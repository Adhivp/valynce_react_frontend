import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider } from './context/WalletContext';
import Navbar from './components/Navbar';
import Marketplace from './pages/Marketplace';
import DatasetDetail from './pages/DatasetDetail';
import MyDatasets from './pages/MyDatasets';
import MyLicenses from './pages/MyLicenses';
import Upload from './pages/Upload';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <Router>
          <div className="min-h-screen bg-black">
            <Navbar />
            <Routes>
              <Route path="/" element={<Marketplace />} />
              <Route path="/dataset/:id" element={<DatasetDetail />} />
              <Route path="/my-datasets" element={<MyDatasets />} />
              <Route path="/my-licenses" element={<MyLicenses />} />
              <Route path="/upload" element={<Upload />} />
            </Routes>
          </div>
        </Router>
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
