import { apiURL } from './api';

export const getAllStores = (data) => apiURL.get('/Stores/', data);        // READ all
export const getStoreById = (id) => apiURL.get(`/Stores/${id}`); // READ one
export const createStore = (data) => apiURL.post('/Stores/', data); // CREATE
export const updateStore = (id, data) => apiURL.put(`/Stores/${id}`, data); // UPDATE
export const deleteStore = (id) => apiURL.delete(`/Stores/${id}`); // DELETE