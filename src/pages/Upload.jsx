import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, FileText, DollarSign, Tag, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { datasetsAPI } from '../api/client';
import Button from '../components/Button';

const categories = [
  'Climate',
  'Healthcare',
  'Finance',
  'NLP',
  'Computer Vision',
  'E-Commerce',
  'Bioinformatics',
  'Geospatial',
];

const Upload = () => {
  const { connected, address, connectWallet } = useWallet();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: categories[0],
    price_apt: '',
    size_mb: '',
    format: '',
    ipfs_uri: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!connected) {
      await connectWallet();
      return;
    }

    try {
      setUploading(true);

      const datasetData = {
        ...formData,
        owner_wallet: address,
        price_apt: parseFloat(formData.price_apt),
        size_mb: parseFloat(formData.size_mb),
      };

      await datasetsAPI.create(datasetData);

      alert('Dataset uploaded successfully!');
      navigate('/my-datasets');
    } catch (error) {
      console.error('Error uploading dataset:', error);
      alert('Failed to upload dataset. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <UploadIcon className="w-20 h-20 text-cyan-400 mx-auto" />
          <h2 className="text-3xl font-bold text-white">Connect Your Wallet</h2>
          <p className="text-gray-400">Connect your wallet to upload datasets</p>
          <Button onClick={connectWallet} variant="primary" size="lg">
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Upload Dataset</h1>
          <p className="text-gray-400">Share your dataset with the community</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-2xl border border-cyan-500/30 p-8 space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-2">
              <FileText className="inline w-4 h-4 mr-2" />
              Dataset Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20"
              placeholder="e.g., Global Climate Data 2020-2024"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20 resize-none"
              placeholder="Provide a detailed description of your dataset..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-2">
              <Tag className="inline w-4 h-4 mr-2" />
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-2">
              <DollarSign className="inline w-4 h-4 mr-2" />
              Price (APT)
            </label>
            <input
              type="number"
              name="price_apt"
              value={formData.price_apt}
              onChange={handleInputChange}
              required
              step="0.01"
              min="0"
              className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20"
              placeholder="e.g., 10.5"
            />
          </div>

          {/* Size & Format */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-400 text-sm font-semibold mb-2">
                <Database className="inline w-4 h-4 mr-2" />
                Size (MB)
              </label>
              <input
                type="number"
                name="size_mb"
                value={formData.size_mb}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="e.g., 2500"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-semibold mb-2">
                Format
              </label>
              <input
                type="text"
                name="format"
                value={formData.format}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="e.g., CSV, JSON"
              />
            </div>
          </div>

          {/* IPFS URI */}
          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-2">
              IPFS URI (Optional)
            </label>
            <input
              type="text"
              name="ipfs_uri"
              value={formData.ipfs_uri}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20"
              placeholder="ipfs://..."
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-cyan-500/20">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              icon={UploadIcon}
              loading={uploading}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Dataset'}
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Upload;
