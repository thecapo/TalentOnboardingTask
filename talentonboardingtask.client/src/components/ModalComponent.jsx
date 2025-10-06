import React from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { DeleteConfirmation } from './DeleteConfirmation';

export const ModalComponent = ({ open, setOpen, entityName, children, formData, onDelete, showDelete, setShowDelete }) => {
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(true)} // DISABLE backdrop click or overlay click, if user doesn't click cancel and click the backdrop it resets the showDelete state and all forms will show up
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur bg-gray-500/50"
        >
            <DialogPanel className="bg-white rounded-md shadow-md w-full max-w-lg">
                <DialogTitle className="text-lg font-bold pb-[15px] mb-4 border-b-[1px] border-gray-300 px-6 pt-6">
                    {showDelete
                        ? `Delete ${entityName}`
                        : formData?.id
                            ? `Edit ${entityName}`
                            : `Create ${entityName}`
                    }
                </DialogTitle>


                {showDelete ? (
                    <DeleteConfirmation
                        entityName={entityName}
                        onDelete={onDelete}
                        onCancel={() => {
                            setShowDelete(false);
                            setOpen(false);
                        }}
                    />
                ) : (
                    children
                )}
            </DialogPanel>
        </Dialog>
    );
};