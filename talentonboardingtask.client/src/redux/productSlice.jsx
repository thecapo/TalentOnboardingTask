import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as productService from '../services/productService';

//get all products
export const getProducts = createAsyncThunk(
    'products/getProducts',
    async ({ page = 1, size = 100 } = {}) => {
        const response = await productService.getAllProducts({
            params: {
                Page: page,
                Size: size,
            },
        });
        return {
            products: response.data.products, // products is added due to the changes in the backend, object wrapping
            page,
            size,
        };
    }
);

// create a product
export const postProduct = createAsyncThunk(
    'products/postProduct',
    async (productData, { rejectWithValue }) => {
        try {
            const response = await productService.createProduct(productData);

            return response.data; // This will be the payload of the fulfilled action


        } catch (error) {
            // Use rejectWithValue to pass a custom error payload
            return rejectWithValue(error.response.data);
        }
    }
);

// update a product
export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async (productData, { rejectWithValue }) => {
        try {
            const response = await productService.updateProduct(
                productData.id,
                productData
            );
            return response.data;
        } catch (error) {
            // Handle errors and return them using rejectWithValue
            return rejectWithValue(error.response.data);
        }
    }
);

// delete a product
export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (productId, { rejectWithValue }) => {
        try {
            await productService.deleteProduct(productId);
            return productId; // Return the ID of the deleted product
        } catch (error) {
            // Handle errors and return a rejected value
            return rejectWithValue(error.response.data);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        status: 'idle',
        products: [],
        error: null,
        page: 1,
        size: [1, 5, 10, 100],
    },
    reducers: {
    },
    extraReducers: (builder) => {
        // get all products
        builder.addCase(getProducts.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(getProducts.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.products = action.payload.products || []; // action.payload.product the products (from axios return) allows it to be place as an array, otherwise an error will come data.map is not a function
            state.page = action.payload.page || 1;
            state.displaySize = action.payload.size || 10;
        });
        builder.addCase(getProducts.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });

        // post
        builder.addCase(postProduct.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(postProduct.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.products.push(action.payload);
        });
        builder.addCase(postProduct.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });

        // update
        builder.addCase(updateProduct.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(updateProduct.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Find and update the specific product in the state
            const index = state.products.findIndex((product) => product.id === action.payload.id);
            if (index !== -1) {
                state.products[index] = action.payload;
            }
        });
        builder.addCase(updateProduct.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });

        // delete
        builder.addCase(deleteProduct.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(deleteProduct.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Filter out the deleted post from the state
            state.products = state.products.filter(item => item.id !== action.payload); // Delete an item by ID
        });
        builder.addCase(deleteProduct.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });
    }
});

export default productSlice.reducer;