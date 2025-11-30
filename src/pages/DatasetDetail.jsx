import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Lock, Calendar, Database, ExternalLink, Shield, Zap, ShoppingCart } from 'lucide-react';
import { datasetsAPI, aptosAPI } from '../api/client';
import { useWallet } from '../context/WalletContext';
import Button from '../components/Button';
import Modal from '../components/Modal';

const DatasetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { connected, address, balance, connectWallet, refreshBalance } = useWallet();
  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedLicenseType, setSelectedLicenseType] = useState('standard');

  useEffect(() => {
    fetchDataset();
  }, [id]);

  const fetchDataset = async () => {
    try {
      setLoading(true);
      const response = await datasetsAPI.getById(id);
      setDataset(response.data);
    } catch (error) {
      console.error('Error fetching dataset:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!connected) {
      await connectWallet();
      return;
    }

    if (balance < parseFloat(dataset.price_apt)) {
      alert('Insufficient balance to purchase this dataset!');
      return;
    }

    try {
      setPurchasing(true);

      // Call Aptos payment API
      const paymentResponse = await aptosAPI.payLicense({
        buyer_address: address,
        dataset_id: dataset.id,
        amount: dataset.price_apt,
      });

      // Record purchase in database
      const purchaseData = {
        dataset_id: dataset.id,
        buyer_wallet: address,
        license_type: selectedLicenseType,
        transaction_hash: paymentResponse.data.transaction_hash,
      };

      await datasetsAPI.purchaseLicense(purchaseData);

      alert('Purchase successful! Check "My Licenses" to access your dataset.');
      refreshBalance();
      setShowPurchaseModal(false);
    } catch (error) {
      console.error('Error purchasing dataset:', error);
      alert('Failed to purchase dataset. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Dataset not found</p>
      </div>
    );
  }

  const formatPrice = (price) => `${parseFloat(price).toFixed(2)} APT`;
  const formatSize = (size) => size >= 1000 ? `${(size / 1000).toFixed(1)} GB` : `${size} MB`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/')}
          className="mb-8 flex items-center space-x-2 text-cyan-400 hover:text-cyan-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Marketplace</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Header Card */}
            <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-2xl border border-cyan-500/30 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-semibold">
                      {dataset.category}
                    </span>
                    {dataset.nft_minted && (
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-sm font-bold flex items-center space-x-1">
                        <Lock className="w-3 h-3" />
                        <span>NFT</span>
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl font-bold text-white">{dataset.title}</h1>
                  <p className="text-gray-400">by {dataset.owner_wallet.slice(0, 6)}...{dataset.owner_wallet.slice(-4)}</p>
                </div>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed">{dataset.description}</p>
            </div>

            {/* Dataset Info */}
            <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-2xl border border-cyan-500/30 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Dataset Information</h2>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Database className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-gray-400 text-sm">Size</div>
                    <div className="text-white font-semibold">{formatSize(dataset.size_mb)}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-gray-400 text-sm">Format</div>
                    <div className="text-white font-semibold">{dataset.format}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Download className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-gray-400 text-sm">Downloads</div>
                    <div className="text-white font-semibold">{dataset.download_count}</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-gray-400 text-sm">License</div>
                    <div className="text-white font-semibold">Commercial Use</div>
                  </div>
                </div>
              </div>

              {dataset.ipfs_uri && (
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-cyan-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-400 text-sm mb-1">IPFS URI</div>
                      <code className="text-cyan-400 text-sm break-all">{dataset.ipfs_uri}</code>
                    </div>
                    <ExternalLink className="w-5 h-5 text-cyan-400 flex-shrink-0 ml-4" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Purchase Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-2xl border border-cyan-500/30 p-8 space-y-6">
              <div className="text-center pb-6 border-b border-cyan-500/20">
                <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {formatPrice(dataset.price_apt)}
                </div>
                <div className="text-gray-400 mt-2">One-time purchase</div>
              </div>

              {/* License Type Selection */}
              <div className="space-y-3">
                <label className="text-gray-400 text-sm">License Type</label>
                <div className="space-y-2">
                  {['standard', 'extended', 'enterprise'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedLicenseType(type)}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        selectedLicenseType === type
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400'
                          : 'bg-gray-800/50 border border-cyan-500/20 hover:border-cyan-400/50'
                      }`}
                    >
                      <div className="font-semibold text-white capitalize">{type}</div>
                      <div className="text-sm text-gray-400">
                        {type === 'standard' && 'Personal & commercial use'}
                        {type === 'extended' && 'Unlimited commercial use'}
                        {type === 'enterprise' && 'Full rights & redistribution'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setShowPurchaseModal(true)}
                variant="primary"
                size="lg"
                className="w-full"
                icon={ShoppingCart}
              >
                Purchase License
              </Button>

              <div className="space-y-3 pt-6 border-t border-cyan-500/20">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Instant access after purchase</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>Secure blockchain transaction</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>NFT ownership certificate</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      <Modal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        title="Confirm Purchase"
      >
        <div className="space-y-6">
          <div className="p-4 bg-gray-800/50 rounded-lg border border-cyan-500/20 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Dataset</span>
              <span className="text-white font-semibold">{dataset.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">License Type</span>
              <span className="text-white font-semibold capitalize">{selectedLicenseType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Price</span>
              <span className="text-cyan-400 font-bold text-xl">{formatPrice(dataset.price_apt)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-cyan-500/20">
              <span className="text-gray-400">Your Balance</span>
              <span className="text-white font-semibold">{balance.toFixed(2)} APT</span>
            </div>
          </div>

          <p className="text-gray-400 text-sm">
            By purchasing this dataset, you agree to the terms and conditions of the selected license type.
            The transaction will be processed on the Aptos blockchain.
          </p>

          <div className="flex space-x-3">
            <Button
              onClick={() => setShowPurchaseModal(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              variant="primary"
              className="flex-1"
              loading={purchasing}
              disabled={purchasing}
            >
              {purchasing ? 'Processing...' : 'Confirm Purchase'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DatasetDetail;
