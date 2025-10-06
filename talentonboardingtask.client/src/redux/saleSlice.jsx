import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as saleService from '../services/saleService';

//get all sales
export const getSales = createAsyncThunk(
    'sales/getSales',
    async ({ page = 1, size = 100 } = {}) => {
        const response = await saleService.getAllSales({
            params: {
                Page: page,
                Size: size,
            },
        });
        return {
            sales: response.data,
            page,
            size,
        };
    }
);

// create a sale
export const postSale = createAsyncThunk(
    'sales/postSale',
    async (saleData, { rejectWithValue }) => {
        try {
            const response = await saleService.createSale(saleData);
            return response.data; // This will be the payload of the fulfilled action

        } catch (error) {
            // Use rejectWithValue to pass a custom error payload
            return rejectWithValue(error.response.data);
        }
    }
);

// update a sale
export const updateSale = createAsyncThunk(
    'sales/updateSale',
    async (saleData, { rejectWithValue }) => {
        try {
            const response = await saleService.updateSale(
                saleData.id,
                saleData
            );
            return response.data;
        } catch (error) {
            // Handle errors and return them using rejectWithValue
            return rejectWithValue(error.response.data);
        }
    }
);

// delete a sale
export const deleteSale = createAsyncThunk(
    'sales/deleteSale',
    async (saleId, { rejectWithValue }) => {
        try {
            await saleService.deleteSale(saleId);
            return saleId; // Return the ID of the deleted sale
        } catch (error) {
            // Handle errors and return a rejected value
            return rejectWithValue(error.response.data);
        }
    }
);

const saleSlice = createSlice({
    name: 'sales',
    initialState: {
        status: 'idle',
        sales: [],
        error: null,
        page: 1,
        size: [1, 5, 10, 100],
    },
    reducers: {
    },
    extraReducers: (builder) => {
        // get all sales
        builder.addCase(getSales.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(getSales.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.sales = action.payload.sales || []; // action.payload.sale the sales (from axios return) allows it to be place as an array, otherwise an error will come data.map is not a function
            state.page = action.payload.page || 1;
            state.displaySize = action.payload.size || 10;
        });
        builder.addCase(getSales.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });

        // post
        builder.addCase(postSale.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(postSale.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.sales.push(action.payload);
        });
        builder.addCase(postSale.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });

        // update
        builder.addCase(updateSale.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(updateSale.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Find and update the specific sale in the state
            const index = state.sales.findIndex((sale) => sale.id === action.payload.id);
            if (index !== -1) {
                state.sales[index] = action.payload;
            }
        });
        builder.addCase(updateSale.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });

        // delete
        builder.addCase(deleteSale.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(deleteSale.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Filter out the deleted post from the state
            state.sales = state.sales.filter(item => item.id !== action.payload); // Delete an item by ID
        });
        builder.addCase(deleteSale.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });
    }
});

export default saleSlice.reducer;