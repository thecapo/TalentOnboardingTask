import { apiURL } from './api';

export const getAllProducts = (data) => apiURL.get('/Products/', data);        // READ all
export const getProductById = (id) => apiURL.get(`/Products/${id}`); // READ one
export const createProduct = (data) => apiURL.post('/Products/', data); // CREATE
export const updateProduct = (id, data) => apiURL.put(`/Products/${id}`, data); // UPDATE
export const deleteProduct = (id) => apiURL.delete(`/Products/${id}`); // DELETE