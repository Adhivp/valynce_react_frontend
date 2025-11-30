import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { datasetsAPI } from '../api/client';
import DatasetCard from '../components/DatasetCard';
import Button from '../components/Button';

const categories = [
  'All',
  'Climate',
  'Healthcare',
  'Finance',
  'NLP',
  'Computer Vision',
  'E-Commerce',
  'Bioinformatics',
  'Geospatial',
];

const Marketplace = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDatasets();
  }, [selectedCategory, searchQuery]);

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      
      const response = await datasetsAPI.getAll(params);
      setDatasets(response.data);
    } catch (error) {
      console.error('Error fetching datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-purple-500/5 to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-semibold">Decentralized Data Marketplace</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Discover Premium
              </span>
              <br />
              <span className="text-white">Datasets</span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore, purchase, and trade high-quality datasets as NFTs on the Aptos blockchain
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search datasets by title, category, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-cyan-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center space-x-8 pt-4"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">{datasets.length}</div>
                <div className="text-sm text-gray-400">Datasets</div>
              </div>
              <div className="w-px h-12 bg-cyan-500/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{datasets.filter(d => d.nft_minted).length}</div>
                <div className="text-sm text-gray-400">NFTs Minted</div>
              </div>
              <div className="w-px h-12 bg-cyan-500/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">{categories.length - 1}</div>
                <div className="text-sm text-gray-400">Categories</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-20 z-40 backdrop-blur-xl bg-black/50 border-y border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <Filter className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-cyan-400 border border-cyan-500/20'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Datasets Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : datasets.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No datasets found. Try adjusting your filters.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {datasets.map((dataset, index) => (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DatasetCard
                  dataset={dataset}
                  onClick={() => navigate(`/dataset/${dataset.id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
