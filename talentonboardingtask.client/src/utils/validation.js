export function isValidString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

export function isValidNumber(value) {
    // Parse price as float
    const numericPrice = parseFloat(value);

    // Check if price is a valid number and >= 0
    // Check for invalid, negative, or zero values
    if (isNaN(numericPrice) || numericPrice < 0 || numericPrice === 0) {
        return false;
    }

    // Passed all checks — valid number
    return true;
}

export function trimFields(data) {
    const trimmed = {};
    for (const key in data) {
        trimmed[key] = typeof data[key] === 'string' ? data[key].trim() : data[key];
    }
    return trimmed;
}

export function validateForm(entity, data) {
    const type = entity.toLowerCase();
    const trimmedData = trimFields(data); // auto-trim before validation
    const error = (message) => ({ valid: false, message });

    switch (type) {
        case 'customer':
            if (!isValidString(trimmedData.name) && !isValidString(trimmedData.address)) {
                return error('Name and Address cannot be empty or just spaces.');
            }
            if (!isValidString(trimmedData.name)) {
                return error('Name cannot be empty or just spaces.');
            }
            if (!isValidString(trimmedData.address)) {
                return error('Address cannot be empty or just spaces.');
            }
            return { valid: true };

        case 'product':
            if (!isValidString(trimmedData.name)) {
                return error('Product name cannot be empty or just spaces.');
            }
            if (!isValidNumber(trimmedData.price)) {
                return error('Price must be a valid non-negative or zero number.');
            }
            if (!isValidString(trimmedData.name) || !isValidNumber(trimmedData.price)) {
                return error('Product name and price cannot be empty or just spaces.');
            }
            return { valid: true };

        case 'store':
            if (!isValidString(trimmedData.name) && !isValidString(trimmedData.address)) {
                return error('Name and Address cannot be empty or just spaces.');
            }
            if (!isValidString(trimmedData.name)) {
                return error('Name cannot be empty or just spaces.');
            }
            if (!isValidString(trimmedData.address)) {
                return error('Address cannot be empty or just spaces.');
            }
            return { valid: true };

        case 'sale':
            if (!trimmedData.customerId || !trimmedData.productId || !trimmedData.storeId) {
                return error('Customer, Product, and Store are required.');
            }
            if (!trimmedData.dateSold) {
                return error('Date Sold is required.');
            }
            return { valid: true };

        default:
            return error('Invalid entity type provided.');
    }
}