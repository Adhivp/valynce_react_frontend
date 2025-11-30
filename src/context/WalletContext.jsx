import React, { createContext, useContext, useState, useEffect } from 'react';
import { aptosAPI } from '../api/client';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [balance, setBalance] = useState(0);

  // Load saved wallet from localStorage on mount
  useEffect(() => {
    const savedWallet = localStorage.getItem('valynce_wallet');
    if (savedWallet) {
      const wallet = JSON.parse(savedWallet);
      setAddress(wallet.address);
      setPrivateKey(wallet.privateKey);
      setConnected(true);
      fetchBalance(wallet.address);
    }
  }, []);

  const fetchBalance = async (addr) => {
    try {
      const response = await aptosAPI.getBalance(addr);
      setBalance(response.data.balance_apt || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(0);
    }
  };

  const connectWallet = async () => {
    try {
      // Check if wallet already exists
      const savedWallet = localStorage.getItem('valynce_wallet');
      if (savedWallet) {
        const wallet = JSON.parse(savedWallet);
        setAddress(wallet.address);
        setPrivateKey(wallet.privateKey);
        setConnected(true);
        await fetchBalance(wallet.address);
        return wallet;
      }

      // Create new wallet via backend
      const response = await aptosAPI.createAccount();
      const { address: newAddress, private_key } = response.data;
      
      const wallet = {
        address: newAddress,
        privateKey: private_key,
      };
      
      setAddress(newAddress);
      setPrivateKey(private_key);
      setConnected(true);
      localStorage.setItem('valynce_wallet', JSON.stringify(wallet));
      
      // Fund the new account from faucet
      try {
        await aptosAPI.fundAccount({ address: newAddress, amount: 100000000 });
        await fetchBalance(newAddress);
      } catch (fundError) {
        console.error('Error funding account:', fundError);
      }
      
      return wallet;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setAddress(null);
    setPrivateKey(null);
    setBalance(0);
    localStorage.removeItem('valynce_wallet');
  };

  const refreshBalance = () => {
    if (address) {
      fetchBalance(address);
    }
  };

  const fundAccount = async () => {
    if (!address) return;
    try {
      await aptosAPI.fundAccount({ address, amount: 100000000 }); // 1 APT
      // Wait a bit for transaction to process
      await new Promise(resolve => setTimeout(resolve, 3000));
      await fetchBalance(address);
      return true;
    } catch (error) {
      console.error('Error funding account:', error);
      return false;
    }
  };

  const value = {
    connected,
    address,
    privateKey,
    balance,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    fundAccount,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
