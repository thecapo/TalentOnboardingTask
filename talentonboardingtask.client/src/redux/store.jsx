import { configureStore } from '@reduxjs/toolkit';
import customerReducer from '../redux/customerSlice';
import productReducer from '../redux/productSlice';
import storeReducer from '../redux/storeSlice';
import saleReducer from './saleSlice';

export const store = configureStore({
    reducer: {
        customers: customerReducer,
        products: productReducer,
        stores: storeReducer,
        sales: saleReducer,
    }
});