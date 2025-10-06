import { apiURL } from './api';

export const getAllSales = (data) => apiURL.get('/Sales/', data);        // READ all
export const getSaleById = (id) => apiURL.get(`/Sales/${id}`); // READ one
export const createSale = (data) => apiURL.post('/Sales/', data); // CREATE
export const updateSale = (id, data) => apiURL.put(`/Sales/${id}`, data); // UPDATE
export const deleteSale = (id) => apiURL.delete(`/Sales/${id}`); // DELETE