import axios from 'axios';

export const apiURL = axios.create({
    baseURL: 'deploymenttask.azurewebsites.net/api',
    headers: {
        'Content-Type': 'application/json',
    },
});