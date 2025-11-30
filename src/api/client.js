import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dataset APIs
export const datasetsAPI = {
  getAll: (params) => api.get('/api/datasets/', { params }),
  getById: (id) => api.get(`/api/datasets/${id}`),
  create: (data) => api.post('/api/datasets/', data),
  mint: (id, txHash) => api.post(`/api/datasets/mint/${id}`, { transaction_hash: txHash }),
  purchaseLicense: (data) => api.post('/api/datasets/purchase', data),
  getUserLicenses: (wallet) => api.get(`/api/datasets/user/${wallet}/licenses`),
  getUserDatasets: (wallet) => api.get(`/api/datasets/user/${wallet}/owned`),
  getCategories: () => api.get('/api/datasets/categories'),
};

// Aptos APIs
export const aptosAPI = {
  getInfo: () => api.get('/aptos/'),
  createAccount: () => api.post('/aptos/account/create'),
  getBalance: (address) => api.get(`/aptos/account/balance/${address}`),
  fundAccount: (data) => api.post('/aptos/account/fund', data),
  mintDataset: (data) => api.post('/aptos/dataset/mint', data),
  grantLicense: (data) => api.post('/aptos/license/grant', data),
  setPrice: (data) => api.post('/aptos/payment/set-price', data),
  payLicense: (data) => api.post('/aptos/payment/pay-license', data),
  setRoyalty: (data) => api.post('/aptos/royalty/set', data),
  getTransaction: (hash) => api.get(`/aptos/transaction/${hash}`),
};

export default api;
