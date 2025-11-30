import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Calendar, Clock, ExternalLink } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { datasetsAPI } from '../api/client';
import Button from '../components/Button';

const MyLicenses = () => {
  const { connected, address, connectWallet } = useWallet();
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (connected && address) {
      fetchLicenses();
    }
  }, [connected, address]);

  const fetchLicenses = async () => {
    try {
      setLoading(true);
      const response = await datasetsAPI.getUserLicenses(address);
      setLicenses(response.data);
    } catch (error) {
      console.error('Error fetching licenses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <Key className="w-20 h-20 text-cyan-400 mx-auto" />
          <h2 className="text-3xl font-bold text-white">Connect Your Wallet</h2>
          <p className="text-gray-400">Connect your wallet to view your licenses</p>
          <Button onClick={connectWallet} variant="primary" size="lg">
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">My Licenses</h1>
          <p className="text-gray-400">Manage your purchased dataset licenses</p>
        </motion.div>

        {licenses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Key className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">You don't have any licenses yet</p>
            <p className="text-gray-500 mt-2">Purchase datasets from the marketplace to get started</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {licenses.map((license, index) => (
              <motion.div
                key={license.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-xl border border-cyan-500/30 p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{license.dataset.title}</h3>
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-semibold">
                      {license.dataset.category}
                    </span>
                  </div>
                  <Key className="w-6 h-6 text-cyan-400" />
                </div>

                <div className="space-y-3 pt-4 border-t border-cyan-500/20">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">License Type:</span>
                    <span className="text-white font-semibold capitalize">{license.license_type}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Purchased:</span>
                    <span className="text-white">{new Date(license.purchase_date).toLocaleDateString()}</span>
                  </div>

                  {license.expires_at && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">Expires:</span>
                      <span className="text-white">{new Date(license.expires_at).toLocaleDateString()}</span>
                    </div>
                  )}

                  {license.dataset.ipfs_uri && (
                    <div className="pt-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        icon={ExternalLink}
                        onClick={() => window.open(license.dataset.ipfs_uri, '_blank')}
                      >
                        Access Dataset
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLicenses;
