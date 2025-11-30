import React from 'react';
import { motion } from 'framer-motion';
import { Lock, TrendingUp, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const DatasetCard = ({ dataset, onClick }) => {
  const formatPrice = (price) => `${parseFloat(price).toFixed(2)} APT`;
  const formatSize = (size) => size >= 1000 ? `${(size / 1000).toFixed(1)} GB` : `${size} MB`;

  const getCategoryColor = (category) => {
    const colors = {
      'Climate': 'from-green-500 to-emerald-600',
      'Healthcare': 'from-red-500 to-pink-600',
      'Finance': 'from-yellow-500 to-orange-600',
      'NLP': 'from-blue-500 to-indigo-600',
      'Computer Vision': 'from-purple-500 to-fuchsia-600',
      'E-Commerce': 'from-cyan-500 to-teal-600',
      'Bioinformatics': 'from-lime-500 to-green-600',
      'Geospatial': 'from-sky-500 to-blue-600',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-xl overflow-hidden border border-cyan-500/20 hover:border-cyan-400/50 transition-all cursor-pointer group"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* NFT Badge */}
      {dataset.nft_minted && (
        <motion.div
          initial={{ rotate: -12 }}
          whileHover={{ rotate: 0 }}
          className="absolute top-4 right-4 z-10 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-black flex items-center space-x-1"
        >
          <Lock className="w-3 h-3" />
          <span>NFT</span>
        </motion.div>
      )}

      <div className="relative p-6 space-y-4">
        {/* Category Badge */}
        <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(dataset.category)} text-white text-xs font-semibold`}>
          {dataset.category}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
          {dataset.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm line-clamp-3">
          {dataset.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-cyan-500/20">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{formatSize(dataset.size_mb)}</span>
            </div>
            {dataset.download_count > 0 && (
              <div className="flex items-center space-x-1 text-gray-400">
                <TrendingUp className="w-4 h-4" />
                <span>{dataset.download_count}</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {formatPrice(dataset.price_apt)}
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <motion.div
          whileHover={{ x: 5 }}
          className="flex items-center space-x-2 text-cyan-400 text-sm font-semibold pt-2"
        >
          <span>View Details</span>
          <ExternalLink className="w-4 h-4" />
        </motion.div>
      </div>

      {/* Bottom gradient line */}
      <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
    </motion.div>
  );
};

export default DatasetCard;
