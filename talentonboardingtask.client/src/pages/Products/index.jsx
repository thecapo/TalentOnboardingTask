import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TableComponent } from '../../components/TableComponent';
import { ModalComponent } from '../../components/ModalComponent';
import { NewButton } from '../../components/NewButton';
import { SubmitButton } from '../../components/SubmitButton';
import { Response } from '../../components/Response';
import { getProducts, postProduct, updateProduct, deleteProduct } from '../../redux/productSlice';

export const Products = () => {
    const { products, size, page, status, error } = useSelector((state) => state.products);
    const dispatch = useDispatch();

    const [productToDelete, setProductToDelete] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [open, setOpen] = useState(false);
    const [validationError, setValidationError] = useState('');

    const columns = ["name", "price"]; // case sensitive

    useEffect(() => {
        dispatch(getProducts({ page, size }));
    }, [page, dispatch]); // it runs on sizeDisplay change and if [] only runs on mount; 

    const [formData, setFormData] = useState({
        id: null,
        name: '',
        price: ''
    });

    const submitHandler = async (e) => {
        e.preventDefault();

        // Check name - must not be empty or spaces only
        if (formData.name.trim() === '') {
            setValidationError('Name cannot be empty or just spaces.');
            return;
        }

        // Check price - explicitly check for empty string or spaces only
        if (formData.price.trim() === '') {
            setValidationError('Price cannot be empty or just spaces.');
            return;
        }

        // Parse price as float
        let numericPrice = parseFloat(formData.price);

        // Check if price is a valid number and >= 0
        if (isNaN(numericPrice) || numericPrice < 0 || numericPrice === 0) {
            setValidationError('Price must be a valid non-negative or zero number.');
            return;
        }

        // Round to 2 decimals
        numericPrice = Number(numericPrice.toFixed(2));

        setValidationError('');

        const payload = {
            ...formData,
            price: numericPrice,
        };

        if (formData.id) {
            await dispatch(updateProduct(payload));
        } else {
            await dispatch(postProduct(payload));
        }

        await dispatch(getProducts());

        setFormData({
            id: null,
            name: '',
            price: ''
        });
        setOpen(false);
    };


    const handleEdit = (product) => {
        setOpen(true)
        setFormData({
            id: product.id,
            name: product.name,
            price: product.price
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        let sanitizedValue = value;

        if (name === 'price') {
            // Remove spaces
            sanitizedValue = value.replace(/\s+/g, '');

            // Allow only digits and one decimal point
            sanitizedValue = sanitizedValue.replace(/[^0-9.]/g, '');

            // Prevent multiple dots
            const parts = sanitizedValue.split('.');
            if (parts.length > 2) {
                sanitizedValue = parts[0] + '.' + parts[1];
            }

            // Remove leading zeros unless input is '0' or starts with '0.'
            if (!sanitizedValue.startsWith('0.') && sanitizedValue !== '0' && sanitizedValue !== 0) {
                sanitizedValue = sanitizedValue.replace(/^0+/, '');
                if (sanitizedValue === '') sanitizedValue = '0';
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: sanitizedValue
        }));
    };


    const handleDeleteClick = (productId) => {
        setShowDelete(true);
        setOpen(true);
        setProductToDelete(productId);
    };

    const handleDelete = async () => {
        if (productToDelete) {
            await dispatch(deleteProduct(productToDelete));
            await dispatch(getProducts()); // Refresh product list after deletion
        }

        // Close modal and reset state
        setOpen(false);
        setShowDelete(false);
        setProductToDelete(null);
    };

    return (
        <div className="p-4">

            <NewButton setFormData={setFormData} setOpen={setOpen} entityName="Product" />

            <Response status={status} error={error} entityName="Products" />

            <ModalComponent
                setOpen={setOpen}
                open={open}
                formData={formData}
                entityName="Product"
                onDelete={handleDelete}
                showDelete={showDelete}
                setShowDelete={setShowDelete}
            >
                <form onSubmit={submitHandler}>
                    <div className="px-6">
                        {validationError && (
                            <p className="text-red-500 mt-[8px]">{validationError}</p>
                        )}

                        <label>Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Name"
                            pattern="[A-Za-z ]+"
                            title="Only letters are allowed"
                            onChange={handleChange}
                            value={formData.name || ''}
                        />

                        <label>Price <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            name="price"
                            required
                            placeholder="Price"
                            title="Please enter numbers only"
                            onChange={handleChange}
                            value={formData.price || ''}
                        />
                    </div>

                    <SubmitButton
                        disabled={status === 'loading'}
                        status={status}
                        formData={formData}
                        setOpen={setOpen}
                        setValidationError={setValidationError}
                    />
                </form>
            </ModalComponent>

            <TableComponent
                data={products}
                onEdit={handleEdit}
                columns={columns}
                setOpen={false}
                handleDeleteClick={handleDeleteClick}
                size={size} // taken from productSlice
            />
        </div>
    );
};
