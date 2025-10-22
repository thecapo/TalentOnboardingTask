import axios from 'axios';

export const apiURL = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});