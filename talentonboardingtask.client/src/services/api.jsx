import axios from 'axios';

export const apiURL = axios.create({
    baseURL: 'https://localhost:7262/api',
    headers: {
        'Content-Type': 'application/json',
    },
});