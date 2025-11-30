import React, { createContext, useContext, useState, useEffect } from 'react';
import { AptosClient, AptosAccount } from 'aptos';

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
  const [balance, setBalance] = useState(0);
  const [aptosClient] = useState(() => new AptosClient('https://fullnode.testnet.aptoslabs.com'));

  // For demo: simulate wallet connection using localStorage
  useEffect(() => {
    const savedWallet = localStorage.getItem('demo_wallet');
    if (savedWallet) {
      const wallet = JSON.parse(savedWallet);
      setAddress(wallet.address);
      setConnected(true);
      fetchBalance(wallet.address);
    }
  }, []);

  const fetchBalance = async (addr) => {
    try {
      const resources = await aptosClient.getAccountResources(addr);
      const accountResource = resources.find((r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>');
      if (accountResource) {
        setBalance(parseInt(accountResource.data.coin.value) / 100000000); // Convert from Octas
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const connectWallet = async () => {
    try {
      // For demo: allow user to select from seed accounts or connect real wallet
      // In production, integrate with Petra Wallet or Aptos Wallet Adapter
      const demoAccounts = [
        { address: '0x203e9bf58c965f98b788b20732faaf8dc135a827c2803935e623718226722964', name: 'Alice (Researcher)' },
        { address: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', name: 'Bob (Data Scientist)' },
        { address: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890', name: 'Carol (ML Engineer)' },
        { address: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba', name: 'David (Analyst)' },
      ];
      
      // Select first demo account for now
      const selectedAccount = demoAccounts[0];
      setAddress(selectedAccount.address);
      setConnected(true);
      localStorage.setItem('demo_wallet', JSON.stringify(selectedAccount));
      await fetchBalance(selectedAccount.address);
      
      return selectedAccount;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setAddress(null);
    setBalance(0);
    localStorage.removeItem('demo_wallet');
  };

  const refreshBalance = () => {
    if (address) {
      fetchBalance(address);
    }
  };

  const value = {
    connected,
    address,
    balance,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    aptosClient,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
