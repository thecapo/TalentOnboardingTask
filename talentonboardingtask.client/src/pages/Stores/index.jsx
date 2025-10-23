import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TableComponent } from '../../components/TableComponent';
import { ModalComponent } from '../../components/ModalComponent';
import { NewButton } from '../../components/NewButton';
import { SubmitButton } from '../../components/SubmitButton';
import { Response } from '../../components/Response';
import { getStores, postStore, updateStore, deleteStore } from '../../redux/storeSlice';

export const Stores = () => {
    const { stores, size, page, status, error } = useSelector((state) => state.stores);
    const dispatch = useDispatch();

    const [storeToDelete, setStoreToDelete] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [open, setOpen] = useState(false);
    const [validationError, setValidationError] = useState('');

    const columns = ["name", "address"]; // case sensitive

    useEffect(() => {
        dispatch(getStores({ page, size }));
    }, [page, dispatch]); // it runs on sizeDisplay change and if [] only runs on mount; 

    const [formData, setFormData] = useState({
        id: null,
        name: '',
        address: ''
    });

    const submitHandler = async (e) => { // backend was redone to fix length and id assignment issue
        e.preventDefault();

        //
        if (formData.name.trim() === '' || formData.address.trim() === '') {
            setValidationError('Name and Address cannot be empty or just spaces.');
            return;
        }

        setValidationError('');
        //

        if (formData.id) {
            // update store logic
            await dispatch(updateStore(formData));

        } else {
            // create store logic
            await dispatch(postStore(formData));
        }

        await dispatch(getStores()); // refresh list
        setFormData({
            id: null,
            name: '',
            address: ''
        });
        setOpen(false);
    };

    const handleEdit = (store) => {
        setOpen(true)
        setFormData({
            id: store.id,
            name: store.name,
            address: store.address
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDeleteClick = (storeId) => {
        setShowDelete(true);
        setOpen(true);
        setStoreToDelete(storeId);
    };

    const handleDelete = async () => {
        if (storeToDelete) {
            await dispatch(deleteStore(storeToDelete));
            await dispatch(getStores()); // Refresh store list after deletion
        }

        // Close modal and reset state
        setOpen(false);
        setShowDelete(false);
        setStoreToDelete(null);
    };

    return (
        <div className="p-4">

            <NewButton setFormData={setFormData} setOpen={setOpen} entityName="Store" />

            <Response status={status} error={error} entityName="Stores" />

            <ModalComponent
                setOpen={setOpen}
                open={open}
                formData={formData}
                entityName="Store"
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

                        <label>Address <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="address"
                            required
                            placeholder="Address"
                            onChange={handleChange}
                            value={formData.address || ''}
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
                data={stores}
                onEdit={handleEdit}
                columns={columns}
                setOpen={false}
                handleDeleteClick={handleDeleteClick}
                size={size} // taken from storeSlice
            />
        </div>
    );
};
