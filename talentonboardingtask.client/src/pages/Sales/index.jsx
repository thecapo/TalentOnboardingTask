import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TableComponent } from '../../components/TableComponent';
import { ModalComponent } from '../../components/ModalComponent';
import { getCustomers } from "../../redux/customerSlice";
import { getProducts } from "../../redux/productSlice";
import { getStores } from "../../redux/storeSlice";
import { getSales, postSale, updateSale, deleteSale } from '../../redux/saleSlice';
import { NewButton } from '../../components/NewButton';
import { SubmitButton } from '../../components/SubmitButton';
import { Response } from '../../components/Response';
import { salesStyle } from '../Sales/sales.styles';
import { ChevronDownIcon } from '@heroicons/react/20/solid'
 
export const Sales = () => {
    const { sales, size, page, status, error } = useSelector((state) => state.sales);
    const { customers } = useSelector((state) => state.customers);
    const { products } = useSelector((state) => state.products);
    const { stores } = useSelector((state) => state.stores);
    const dispatch = useDispatch();

    const [saleToDelete, setSaleToDelete] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [open, setOpen] = useState(false);

    const columns = ["customer", "product", "store", "dateSold"]; // case sensitive; if it causes error change date sold to date
    const today = new Date();
    const dateNow = today.toISOString().split('T')[0]; // "2025-10-03"

    useEffect(() => {
        dispatch(getSales({ page, size }));
    }, [page, dispatch]); // it runs on sizeDisplay change and if [] only runs on mount;

    useEffect(() => {
        dispatch(getCustomers());
        dispatch(getProducts());
        dispatch(getStores());
    }, [dispatch]);

    const [formData, setFormData] = useState({
        id: null,
        customerId: null,
        productId: null,
        storeId: null,
        customer: '',
        product: '',
        store: '',
        dateSold: dateNow, // must base it on the backend dateSold
    });

    const submitHandler = async (e) => { // backend was redone to fix length and id assignment issue
        e.preventDefault();

        if (formData.id) {
            // update sale logic
            await dispatch(updateSale(formData));

        } else {
            // create sale logic
            await dispatch(postSale(formData)); // last changes
        }

        await dispatch(getSales()); // refresh list
        setFormData({
            id: null,
            customerId: null,
            productId: null,
            storeId: null,
            customer: '',
            product: '',
            store: '',
            dateSold: dateNow,
        });
        setOpen(false);
    };

    const handleEdit = (sale) => {
        setOpen(true)
        setFormData({
            id: sale.id,
            customerId: sale.customerId,
            productId: sale.productId,
            storeId: sale.storeId,
            customer: sale.customer,
            product: sale.product,
            store: sale.store,
            dateSold: sale.dateSold,
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            dateSold: dateNow, // applied first so when the user select another customer, product or store it will not reset
            ...prev,
            [name]: value,
        }));
    };

    const handleDeleteClick = (saleId) => {
        setShowDelete(true);
        setOpen(true);
        setSaleToDelete(saleId);
    };

    const handleDelete = async () => {
        if (saleToDelete) {
            await dispatch(deleteSale(saleToDelete));
            await dispatch(getSales()); // Refresh sale list after deletion
        }

        // Close modal and reset state
        setOpen(false);
        setShowDelete(false);
        setSaleToDelete(null);
    };

    return (
        <div className="p-4">
            <NewButton setFormData={setFormData} setOpen={setOpen} entityName="Sale" />

            <Response status={status} error={error} entityName="Sales" />

            <ModalComponent
                setOpen={setOpen}
                open={open}
                formData={formData}
                entityName="Sale"
                onDelete={handleDelete}
                showDelete={showDelete}
                setShowDelete={setShowDelete}
            >
                <form onSubmit={submitHandler}>
                    <div className="px-[25px]">
                        <label htmlFor="date">Date Sold</label>
                        <input
                            type="date"
                            id="date"
                            name="dateSold"
                            onChange={handleChange}
                            value={formData.dateSold || dateNow}
                            max={dateNow}
                            required
                        />
                        
                        <label htmlFor="customer">Customer</label>
                        <ChevronDownIcon
                            aria-hidden="true"
                            className={salesStyle.chevronCustomStyle}
                        />
                        <select
                            onChange={handleChange}
                            value={formData.customerId || ''}
                            name="customerId"
                            className={salesStyle.select}
                        >
                            <option value=''>{formData.customer || ''}</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="product">Product</label>
                        <ChevronDownIcon
                            aria-hidden="true"
                            className={salesStyle.chevronCustomStyle}
                        />
                        <select
                            onChange={handleChange}
                            value={formData.productId || ''}
                            name="productId"
                            className={salesStyle.select}
                        >
                            <option value={formData.product}>{formData.product || ''}</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="store">Store</label>
                        <ChevronDownIcon
                            aria-hidden="true"
                            className={salesStyle.chevronCustomStyle}
                        />
                        <select
                            onChange={handleChange}
                            value={formData.storeId || ''}
                            name="storeId"
                            className={salesStyle.select}
                        >
                            <option value={formData.store}>{formData.store || ''}</option>
                            {stores.map((store) => (
                                <option key={store.id} value={store.id}>
                                    {store.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <SubmitButton
                        status={status}
                        formData={formData}
                        setOpen={setOpen}
                    />
                </form>
            </ModalComponent>

            <TableComponent
                data={sales}
                onEdit={handleEdit}
                columns={columns}
                setOpen={false}
                handleDeleteClick={handleDeleteClick}
                size={size} // taken from saleSlice might delete this
            />
        </div>
    );
};
