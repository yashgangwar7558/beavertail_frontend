exports.sortInvoices = (invoices, sortBy, sortOrder) => {
    const sortedInvoices = [...invoices];
    switch (sortBy) {
        case 'total':
            sortedInvoices.sort((a, b) => {
                const totalA = parseFloat(a.total);
                const totalB = parseFloat(b.total);

                return sortOrder === 'ascending' ? totalA - totalB : totalB - totalA;
            });
            break;
        case 'invoiceDate':
            sortedInvoices.sort((a, b) => {
                const dateA = new Date(a.invoiceDate);
                const dateB = new Date(b.invoiceDate);

                return sortOrder === 'ascending' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
            });
            break;
        default:
            console.error('Invalid sortBy parameter');
    }

    return sortedInvoices;
};

exports.sortSalesReport = (sales, sortBy, sortOrder) => {
    const sortedSales = [...sales];
    switch (sortBy) {
        case 'quantitySold':
            sortedSales.sort((a, b) => {
                const quantitySoldA = parseFloat(a.quantitySold);
                const quantitySoldB = parseFloat(b.quantitySold);

                return sortOrder === 'ascending' ? quantitySoldA - quantitySoldB : quantitySoldB - quantitySoldA;
            });
            break;
        case 'totalSales':
            sortedSales.sort((a, b) => {
                const totalSalesA = parseFloat(a.totalSales);
                const totalSalesB = parseFloat(b.totalSales);

                return sortOrder === 'ascending' ? totalSalesA - totalSalesB : totalSalesB - totalSalesA;
            });
            break;
        case 'totalProfitWmc':
            sortedSales.sort((a, b) => {
                const totalProfitWmcA = parseFloat(a.totalProfitWmc);
                const totalProfitWmcB = parseFloat(b.totalProfitWmc);

                return sortOrder === 'ascending' ? totalProfitWmcA - totalProfitWmcB : totalProfitWmcB - totalProfitWmcA;
            });
            break;
        case 'totalProfitWmc':
        case 'totalProfitWomc':
            sortedSales.sort((a, b) => {
                const profitA = parseFloat(a[sortBy]);
                const profitB = parseFloat(b[sortBy]);

                return sortOrder === 'ascending' ? profitA - profitB : profitB - profitA;
            });
            break;
        default:
            console.error('Invalid sortBy parameter');
    }

    return sortedSales;
};


