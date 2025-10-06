import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export const DeleteConfirmation = ({ onDelete, onCancel }) => {
    return (
        <div>
            <h3 className="text-md font-bold pb-[15px] border-b-[1px] border-gray-300 px-6 ">Are you sure?</h3>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse gap-x-[10px] sm:px-6">
                <button
                    onClick={onDelete}
                    className="bg-red-500 text-white flex items-center justify-between !py-[5px]"
                >

                    Delete

                    <div className="mx-auto flex size-12 shrink-0 items-center justify-end rounded-full bg-transparent-100 sm:mx-0 sm:size-10">
                        <XMarkIcon aria-hidden="true" className="size-6 text-white-600" />
                    </div>
                </button>

                <button
                    onClick={onCancel}
                    className="bg-gray-900 text-white !py-[5px]"
                >

                    Cancel

                </button>
            </div>
        </div>
    );
};
