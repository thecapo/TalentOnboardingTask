import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as customerService from '../services/customerService';

//get all customers
export const getCustomers = createAsyncThunk(
    'customers/getCustomers',
    async ({ page = 1, size = 100 } = {}) => {
        const response = await customerService.getAllCustomers({
            params: {
                Page: page,
                Size: size,
            },
        });
        return {
            customers: response.data,
            page,
            size,
        };
    }
);

// create a customer
export const postCustomer = createAsyncThunk(
    'customers/postCustomer',
    async (customerData, { rejectWithValue }) => {
        try {
            const response = await customerService.createCustomer(customerData);

            return response.data; // This will be the payload of the fulfilled action


        } catch (error) {
            // Use rejectWithValue to pass a custom error payload
            return rejectWithValue(error.response.data);
        }
    }
);

// update a customer
export const updateCustomer = createAsyncThunk(
    'customers/updateCustomer',
    async (customerData, { rejectWithValue }) => {
        try {
            const response = await customerService.updateCustomer(
                customerData.id,
                customerData
            );
            return response.data;
        } catch (error) {
            // Handle errors and return them using rejectWithValue
            return rejectWithValue(error.response.data);
        }
    }
);

// delete a customer
export const deleteCustomer = createAsyncThunk(
    'customers/deleteCustomer',
    async (customerId, { rejectWithValue }) => {
        try {
            await customerService.deleteCustomer(customerId);
            return customerId; // Return the ID of the deleted customer
        } catch (error) {
            // Handle errors and return a rejected value
            return rejectWithValue(error.response.data);
        }
    }
);

const customerSlice = createSlice({
    name: 'customers',
    initialState: {
        status: 'idle',
        customers: [],
        error: null,
        page: 1,
        size: [1, 5, 10, 100],
    },
    reducers: {
    },
    extraReducers: (builder) => {
        // get all customers
        builder.addCase(getCustomers.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(getCustomers.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.customers = action.payload.customers || []; // action.payload.customer the customers (from axios return) allows it to be place as an array, otherwise an error will come data.map is not a function
            state.page = action.payload.page || 1;
            state.displaySize = action.payload.size || 10;
        });
        builder.addCase(getCustomers.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });

        // post
        builder.addCase(postCustomer.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(postCustomer.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.customers.push(action.payload);
        });
        builder.addCase(postCustomer.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });

        // update
        builder.addCase(updateCustomer.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(updateCustomer.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Find and update the specific customer in the state
            const index = state.customers.findIndex((customer) => customer.id === action.payload.id);
            if (index !== -1) {
                state.customers[index] = action.payload;
            }
        });
        builder.addCase(updateCustomer.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });

        // delete
        builder.addCase(deleteCustomer.pending, (state, action) => {
            state.status = 'loading';
        });
        builder.addCase(deleteCustomer.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Filter out the deleted post from the state
            state.customers = state.customers.filter(item => item.id !== action.payload); // Delete an item by ID
        });
        builder.addCase(deleteCustomer.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });
    }
});

export default customerSlice.reducer;