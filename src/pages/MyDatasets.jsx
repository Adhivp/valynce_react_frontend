import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileStack, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { datasetsAPI, aptosAPI } from '../api/client';
import DatasetCard from '../components/DatasetCard';
import Button from '../components/Button';

const MyDatasets = () => {
  const { connected, address, privateKey, connectWallet, refreshBalance } = useWallet();
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (connected && address) {
      fetchMyDatasets();
    }
  }, [connected, address]);

  const fetchMyDatasets = async () => {
    try {
      setLoading(true);
      const response = await datasetsAPI.getUserDatasets(address);
      setDatasets(response.data);
    } catch (error) {
      console.error('Error fetching datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMintNFT = async (datasetId) => {
    try {
      setMinting(datasetId);

      if (!privateKey) {
        alert('Private key not found. Please reconnect your wallet.');
        return;
      }

      // Call Aptos mint API
      const mintResponse = await aptosAPI.mintDataset({
        private_key: privateKey,
        dataset_id: datasetId,
        hash: `hash_${datasetId}_${Date.now()}`,
        uri: `ipfs://dataset_${datasetId}`,
      });

      if (mintResponse.data.success) {
        // Update dataset in database
        await datasetsAPI.mint(datasetId, mintResponse.data.transaction_hash);

        alert('NFT minted successfully!');
        refreshBalance();
        fetchMyDatasets();
      } else {
        throw new Error(mintResponse.data.error || 'Minting failed');
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint NFT. Please try again.');
    } finally {
      setMinting(null);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <FileStack className="w-20 h-20 text-cyan-400 mx-auto" />
          <h2 className="text-3xl font-bold text-white">Connect Your Wallet</h2>
          <p className="text-gray-400">Connect your wallet to view your datasets</p>
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
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Datasets</h1>
            <p className="text-gray-400">Manage your uploaded datasets</p>
          </div>
          <Button onClick={() => navigate('/upload')} variant="primary">
            Upload New Dataset
          </Button>
        </motion.div>

        {datasets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <FileStack className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">You haven't uploaded any datasets yet</p>
            <p className="text-gray-500 mt-2">Upload your first dataset to get started</p>
            <Button onClick={() => navigate('/upload')} variant="primary" size="lg" className="mt-6">
              Upload Dataset
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {datasets.map((dataset, index) => (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <DatasetCard
                  dataset={dataset}
                  onClick={() => navigate(`/dataset/${dataset.id}`)}
                />
                
                {!dataset.nft_minted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4"
                  >
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMintNFT(dataset.id);
                      }}
                      variant="primary"
                      size="sm"
                      className="w-full"
                      icon={Lock}
                      loading={minting === dataset.id}
                      disabled={minting === dataset.id}
                    >
                      {minting === dataset.id ? 'Minting...' : 'Mint as NFT'}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDatasets;
