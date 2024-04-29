exports.filterInvoices = (invoices, filterBy, value) => {
    if (value === 'All') {
        return invoices
    }

    return invoices.filter(invoice => {
        if (filterBy === 'vendor') {
            return invoice.vendor === value;
        } else if (filterBy === 'status') {
            return invoice.status.type === value;
        }

        return true
    })
}

exports.filterAlerts = (alerts, filterBy, value) => {
    if (value === 'All') {
        return alerts
    }

    const currentDate = new Date();
    const todayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const thisWeekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
    const thisMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    return alerts.filter(alert => {
        if (filterBy === 'type') {
            return alert.type === value;
        } else if (filterBy === 'severity') {
            return alert.severity === value;
        } else if (filterBy === 'time') {
            if (value === 'today') {
                return new Date(alert.date) >= todayStart;
            } else if (value === 'week') {
                return new Date(alert.date) >= thisWeekStart;
            } else if (value === 'month') {
                return new Date(alert.date) >= thisMonthStart;
            }
        }

        return true
    })
}