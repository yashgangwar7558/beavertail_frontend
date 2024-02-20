exports.filterInvoices = (invoices, filterBy, value) => {
    if (value === 'All') {
        return invoices;
    }

    return invoices.filter(invoice => {
        if (filterBy === 'vendor') {
            return invoice.vendor === value;
        } else if (filterBy === 'status') {
            return invoice.status.type === value;
        }

        return true;
    });
};