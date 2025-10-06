import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

export const SubmitButton = ({ status, formData, setOpen }) => (
    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse gap-x-[10px] sm:px-6">
        <button
            type="submit"
            disabled={status === 'loading'}
            className={`bg-green-900 text-white flex items-center justify-between !py-[5px] ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
        >

            {formData?.id ? 'edit' : 'create'}

            <div className="mx-auto flex size-12 shrink-0 items-center justify-end rounded-full bg-transparent-100 sm:mx-0 sm:size-10">
                <CheckIcon aria-hidden="true" className="size-6 text-white-600" />
            </div>
        </button>

        <button
            type="button"
            onClick={() => setOpen(false)}
            className="bg-gray-900 text-white !py-[5px]"
        >

            cancel

        </button>
    </div>
);