import React from 'react';

export const PaginatedComponent = ({ currentPage, goToPage, totalPages }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav style={{ marginTop: '20px' }}>
            <ul style={{ display: 'flex', listStyle: 'none', padding: 0, gap: '8px', justifyContent: 'center' }}>
                {/* Prev Button */}
                <li>
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={buttonStyle(currentPage === 1)}
                    >
                        Prev
                    </button>
                </li>

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

                {/* Next Button */}
                <li>
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={buttonStyle(currentPage === totalPages)}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

// Styling helper function
const buttonStyle = (disabled, active = false) => ({
    padding: '6px 12px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    backgroundColor: active ? '#007bff' : disabled ? '#eee' : '#f0f0f0',
    color: active ? 'white' : 'black',
    border: '1px solid #ccc',
    borderRadius: '4px',
    opacity: disabled ? 0.6 : 1,
});