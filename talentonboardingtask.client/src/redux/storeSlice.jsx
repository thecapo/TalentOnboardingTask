import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as storeService from '../services/storeService';

//get all stores
export const getStores = createAsyncThunk(
    'stores/getStores',
    async ({ page = 1, size = 100 } = {}) => {
        const response = await storeService.getAllStores({
            params: {
                Page: page,
                Size: size,
            },
        });
        return {
            stores: response.data.stores, // stores is added due to the changes in the backend, object wrapping
            page,
            size,
        };
    }
);

// create a store
export const postStore = createAsyncThunk(
    'stores/postStore',
    async (storeData, { rejectWithValue }) => {
        try {
            const response = await storeService.createStore(storeData);

            return response.data; // This will be the payload of the fulfilled action


        } catch (error) {
            // Use rejectWithValue to pass a custom error payload
            return rejectWithValue(error.response.data);
        }
    }
);

// update a store
export const updateStore = createAsyncThunk(
    'stores/updateStore',
    async (storeData, { rejectWithValue }) => {
        try {
            const response = await storeService.updateStore(
                storeData.id,
                storeData
            );
            return response.data;
        } catch (error) {
            // Handle errors and return them using rejectWithValue
            return rejectWithValue(error.response.data);
        }
    }
);

// delete a store
export const deleteStore = createAsyncThunk(
    'stores/deleteStore',
    async (storeId, { rejectWithValue }) => {
        try {
            await storeService.deleteStore(storeId);
            return storeId; // Return the ID of the deleted store
        } catch (error) {
            // Handle errors and return a rejected value
            return rejectWithValue(error.response.data);
        }
    }
);

const storeSlice = createSlice({
    name: 'stores',
    initialState: {
        status: 'idle',
        stores: [],
        error: null,
        page: 1,
        size: [1, 5, 10, 100],
    },
    reducers: {
    },
    extraReducers: (builder) => {
        // get all stores
        builder.addCase(getStores.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(getStores.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.stores = action.payload.stores || []; // action.payload.store the stores (from axios return) allows it to be place as an array, otherwise an error will come data.map is not a function
            state.page = action.payload.page || 1;
            state.displaySize = action.payload.size || 10;
        });
        builder.addCase(getStores.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });

        // post
        builder.addCase(postStore.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(postStore.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.stores.push(action.payload);
        });
        builder.addCase(postStore.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });

        // update
        builder.addCase(updateStore.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(updateStore.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Find and update the specific store in the state
            const index = state.stores.findIndex((store) => store.id === action.payload.id);
            if (index !== -1) {
                state.stores[index] = action.payload;
            }
        });
        builder.addCase(updateStore.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });

        // delete
        builder.addCase(deleteStore.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(deleteStore.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Filter out the deleted post from the state
            state.stores = state.stores.filter(item => item.id !== action.payload); // Delete an item by ID
        });
        builder.addCase(deleteStore.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });
    }
});

export default storeSlice.reducer;