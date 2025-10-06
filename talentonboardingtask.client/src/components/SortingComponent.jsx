import React, { useState } from "react";

export const SortingComponent = ({ data, children }) => {
    const [newData, setNewData] = useState(data);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    const sortData = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedData = [...newData].sort((a, b) => {
            if (typeof a[key] === "string") {
                return direction === "asc"
                    ? a[key].localeCompare(b[key])
                    : b[key].localeCompare(a[key]);
            } else {
                return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
            }
        });

        setNewData(sortedData);
        setSortConfig({ key, direction });
    };

    return (
        <div>
            <h2>Sortable Table</h2>
            <div style={{ marginBottom: "1rem" }}>
                <button onClick={() => sortData("name")}>Sort by Name</button>
                <button onClick={() => sortData("address")}>Sort by Address</button>
                <button onClick={() => sortData("price")}>Sort by Price</button>
            </div>

            {children}

            

            <p>
                Sorting by: <strong>{sortConfig.key || "None"}</strong> (
                {sortConfig.direction})
            </p>
        </div>
    );
};