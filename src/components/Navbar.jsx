import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Database, Wallet, FileStack, Key, Upload, LogOut } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const Navbar = () => {
  const { connected, address, balance, connectWallet, disconnectWallet, fundAccount } = useWallet();
  const location = useLocation();
  const [funding, setFunding] = React.useState(false);

  const handleFundAccount = async () => {
    setFunding(true);
    try {
      const success = await fundAccount();
      if (success) {
        alert('Account funded with 1 APT successfully!');
      } else {
        alert('Failed to fund account. Please try again.');
      }
    } catch (error) {
      alert('Error funding account: ' + error.message);
    } finally {
      setFunding(false);
    }
  };

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const navItems = [
    { path: '/', icon: Database, label: 'Marketplace' },
    { path: '/my-datasets', icon: FileStack, label: 'My Datasets' },
    { path: '/my-licenses', icon: Key, label: 'My Licenses' },
    { path: '/upload', icon: Upload, label: 'Upload' },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 blur-lg opacity-75 rounded-lg" />
                <img 
                  src="/Valynce_logo.jpeg" 
                  alt="Valynce Logo" 
                  className="relative w-10 h-10 rounded-lg object-cover"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Valynce
              </span>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                      isActive
                        ? 'text-cyan-400'
                        : 'text-gray-400 hover:text-cyan-300'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className="w-5 h-5 relative z-10" />
                    <span className="relative z-10 font-medium">{item.label}</span>
                  </motion.button>
                </Link>
              );
            })}
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {connected ? (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="hidden sm:flex items-center space-x-3 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-cyan-500/30"
                >
                  <Wallet className="w-5 h-5 text-cyan-400" />
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400">Balance</span>
                    <span className="text-cyan-400 font-bold">{balance.toFixed(2)} APT</span>
                  </div>
                </motion.div>

                {balance === 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFundAccount}
                    disabled={funding}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {funding ? 'Funding...' : 'Fund Account'}
                  </motion.button>
                )}
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/30"
                >
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-cyan-300 font-mono text-sm">
                    {truncateAddress(address)}
                  </span>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={disconnectWallet}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={connectWallet}
                className="relative px-6 py-3 rounded-lg font-semibold text-white overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 group-hover:from-cyan-400 group-hover:to-purple-500 transition-all" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-400 to-purple-500 blur-xl transition-all" />
                <span className="relative flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>Connect Wallet</span>
                </span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
