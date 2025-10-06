import { apiURL } from './api'; 

export const getAllCustomers = (data) => apiURL.get('/Customers/', data);        // READ all
export const getCustomerById = (id) => apiURL.get(`/Customers/${id}`); // READ one
export const createCustomer = (data) => apiURL.post('/Customers/' , data); // CREATE
export const updateCustomer = (id, data) => apiURL.put(`/Customers/${id}`, data); // UPDATE
export const deleteCustomer = (id) => apiURL.delete(`/Customers/${id}`); // DELETE