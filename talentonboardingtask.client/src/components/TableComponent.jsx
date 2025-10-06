import React, { useState, useMemo } from "react";
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export const TableComponent = ({ data, onEdit, handleDeleteClick, columns, size }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
    const [sizeDisplay, setSizeDisplay] = useState(10 || size); // default display is 10 and size when user switches display

    const handleSelect = async (e) => {
        setSizeDisplay(Number(e.target.value))
        setCurrentPage(1); // this resets back to page 1 so it doesn't leave blank
    }

    // Change page
    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // SORTING
    const sortedData = useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    // PAGINATION
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * sizeDisplay;
        return sortedData.slice(start, start + sizeDisplay);
    }, [sortedData, currentPage, sizeDisplay]);

    // Handle sort
    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const totalPages = Math.ceil(data.length / sizeDisplay);

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div>
            {data.length === 0 ? (
                <div className="text-center p-4 text-red-600">No items available</div>
            ) : (
                <table className="table-fixed w-full border-solid">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column} className="capitalize text-left" onClick={() => requestSort(column)}>
                                    {column} 
                                    <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" className="size-5 text-gray-400 inline rotate-180">
                                        <path d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" fill-rule="evenodd" />
                                    </svg>
                                    <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" className="size-5 text-gray-400 inline">
                                        <path d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" fill-rule="evenodd" />
                                    </svg>
                                </th>
                            ))}
                            <th className="text-left">Action</th>
                            <th className="text-left">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedData.map((entry) => (
                            <tr key={entry.id} className="even:bg-white odd:bg-gray-50 dark:even:bg-gray-900/50 odd:even:bg-gray-950">
                                {columns.map((column) => (
                                    <td key={column} className="users-table-cell text-left p-[16px]">
                                        {entry[column]}
                                    </td>
                                ))}
                                <td>
                                    <div className="flex items-center">
                                        <button className="bg-yellow-500 text-white flex items-center uppercase h-[58px]"
                                            onClick={() => onEdit(entry)} >

                                            <div className="mx-auto flex size-12 shrink-0 items-center justify-between rounded-full bg-transparent-100 sm:mx-0 sm:size-10">
                                                <PencilSquareIcon aria-hidden="true" className="size-6 text-white-600" />
                                            </div>

                                            Edit
                                        </button>
                                    </div>
                                </td>
                                <td> 
                                    <div className="flex items-center">
                                        <button className="bg-red-500 text-white flex items-center uppercase h-[58px]"
                                            onClick={() => handleDeleteClick(entry.id)}
                                        >
                                            <div className="mx-auto flex size-12 shrink-0 items-center justify-between rounded-full bg-transparent-100 sm:mx-0 sm:size-10">
                                                <TrashIcon aria-hidden="true" className="size-6 text-white-600" />
                                            </div>

                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {data.length > 0 && (
                <>
                    <select
                        id="display-select"
                        name="display"
                        value={sizeDisplay}
                        onChange={handleSelect} // convert string to number
                        required
                        className="mt-[25px] relative z-1 border cursor-pointer float-left col-start-1 row-start-1 !w-fit appearance-none rounded-md py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                        {size.map((s) => (
                            <option key={s} value={s} >
                                {s}
                            </option>
                        ))}
                    </select>

                    <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" className="-mr-1 mt-[32px] size-5 text-gray-400 relative right-[24px]">
                        <path d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" fill-rule="evenodd" />
                    </svg>

                    <div className="flex p-0 list-none gap-[8px] justify-center float-right mt-[-25px]">
                        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} style={buttonStyle(currentPage === 1)}>
                            Prev
                        </button>

                        {/* Page Numbers */}
                        {pageNumbers.map((number) => (
                                <li key={number}>
                                    <button
                                        onClick={() => goToPage(number)}
                                        style={buttonStyle(false, number === currentPage)}
                                    >
                                        {number}
                                    </button>
                                </li>
                        ))}

                        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} style={buttonStyle(currentPage === totalPages)} >
                            Next
                        </button>
                    </div>
                
                </>
            )}
        </div>
    );
}

// Styling helper function
const buttonStyle = (disabled, active = false) => ({
    padding: '6px 12px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    backgroundColor: active ? '#007bff' : disabled ? '#eee' : '#f0f0f0',
    color: active ? 'white' : 'black',
    border: '1px solid #ccc',
    borderRadius: '4px',
    opacity: disabled ? 0.6 : 1,
    minWidth: '40px',
    width: 'fit-content',
});