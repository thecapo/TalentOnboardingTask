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

    const columns = ["name", "price"]; // case sensitive

    useEffect(() => {
        dispatch(getProducts({ page, size }));
    }, [page, dispatch]); // it runs on sizeDisplay change and if [] only runs on mount; 

    const [formData, setFormData] = useState({
        id: null,
        name: '',
        price: null
    });

    const submitHandler = async (e) => { // backend was redone to fix length and id assignment issue
        e.preventDefault();

        if (formData.id) {
            // update product logic
            await dispatch(updateProduct(formData));

        } else {
            // create product logic
            await dispatch(postProduct(formData));
        }

        await dispatch(getProducts()); // refresh list
        setFormData({
            id: null,
            name: '',
            price: null
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
        setFormData(prev => ({
            ...prev,
            [name]: value
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
                        <label>Name</label>
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

                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            required
                            placeholder="Price"
                            pattern="\d+"
                            title="Please enter numbers only"
                            onChange={handleChange}
                            value={formData.price || ''}
                        />
                    </div>

                    <SubmitButton
                        status={status}
                        formData={formData}
                        setOpen={setOpen}
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
