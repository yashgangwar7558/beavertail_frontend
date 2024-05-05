import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext'
import client from './ApiConfig'

export const TopPurchasesValueWise = () => {
    const { userInfo } = useContext(AuthContext);

    const data = [
        {
            date: '24-12-2024',
            invoiceCount: '10',
            invoiceValue: '2500'
        },
        {
            date: '24-12-2024',
            invoiceCount: '16',
            invoiceValue: '2500'
        },
        {
            date: '24-12-2024',
            invoiceCount: '15',
            invoiceValue: '2500'
        },
        {
            date: '24-12-2024',
            invoiceCount: '12',
            invoiceValue: '2500'
        },
        {
            date: '24-12-2024',
            invoiceCount: '9',
            invoiceValue: '2500'
        },
        {
            date: '24-12-2024',
            invoiceCount: '8',
            invoiceValue: '2500'
        },
        {
            date: '24-12-2024',
            invoiceCount: '10',
            invoiceValue: '2500'
        },
    ]

    return data
}

export const PurchasesTopChange = () => {
    const { userInfo } = useContext(AuthContext);

    const data = [
        {
            date: '24-12-2024',
            vendor: 'Sysco',
            item: 'Chicken',
            value_impact: '200',
            change: '20'
        },
        {
            date: '24-12-2024',
            vendor: 'Sysco',
            item: 'Chicken',
            value_impact: '200',
            change: '20'
        },
        {
            date: '24-12-2024',
            vendor: 'Sysco',
            item: 'Chicken',
            value_impact: '200',
            change: '20'
        },
        {
            date: '24-12-2024',
            vendor: 'Sysco',
            item: 'Chicken',
            value_impact: '200',
            change: '20'
        },
        {
            date: '24-12-2024',
            vendor: 'Sysco',
            item: 'Chicken',
            value_impact: '200',
            change: '20'
        },
        {
            date: '24-12-2024',
            vendor: 'Sysco',
            item: 'Chicken',
            value_impact: '200',
            change: '20'
        },
        {
            date: '24-12-2024',
            vendor: 'Sysco',
            item: 'Chicken',
            value_impact: '200',
            change: '20'
        },
    ]

    return data
}

export const SalesLastSevenDays = () => {
    const { userInfo } = useContext(AuthContext);

    const data = [
        {
            date: '24-12-2024',
            total_orders: 25,
            net_sales: '500',
            profit_percentage: '25%'
        },
        {
            date: '24-12-2024',
            total_orders: 25,
            net_sales: '500',
            profit_percentage: '25%'
        },
        {
            date: '24-12-2024',
            total_orders: 25,
            net_sales: '500',
            profit_percentage: '25%'
        },
        {
            date: '24-12-2024',
            total_orders: 25,
            net_sales: '500',
            profit_percentage: '25%'
        },
        {
            date: '24-12-2024',
            total_orders: 25,
            net_sales: '500',
            profit_percentage: '25%'
        },
        {
            date: '24-12-2024',
            total_orders: 25,
            net_sales: '500',
            profit_percentage: '25%'
        },
        {
            date: '24-12-2024',
            total_orders: 25,
            net_sales: '500',
            profit_percentage: '25%'
        },
    ]

    return data
}

export const TopCategoriesSalesMonth = () => {
    const { userInfo } = useContext(AuthContext);
    const [typeWiseMonthSales, setTypeWiseMonthSales] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentDate = new Date()
                const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                const data = {
                    tenantId: userInfo.user.tenant,
                    startDate: startOfMonth,
                    endDate: endOfMonth,
                };
                const result = await client.post('/get-typewise-sales', data, {
                    headers: { 'Content-Type': 'application/json' },
                });
                setTypeWiseMonthSales(result.data.allTypesSalesData);
            } catch (error) {
                console.log(`Error fetching typewise sales data: ${error}`);
            }
        };
        fetchData();
    }, [])

    const data = typeWiseMonthSales
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, 3)
        .map(item => ({ category: item.subType, value: item.totalSales.toString() }));

    // const data = [
    //     {
    //         category: 'Chinese',
    //         value: '200'
    //     },
    //     {
    //         category: 'Burger',
    //         value: '180'
    //     },
    //     {
    //         category: 'Pizza',
    //         value: '100'
    //     },
    // ]

    return data
}

export const TopCategoriesSalesToday = () => {
    const { userInfo } = useContext(AuthContext);
    const [typeWiseTodaySales, setTypeWiseTodaySales] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentDate = new Date()
                const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
                const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
                const data = {
                    tenantId: userInfo.user.tenant,
                    startDate: startOfDay,
                    endDate: endOfDay,
                };
                const result = await client.post('/get-typewise-sales', data, {
                    headers: { 'Content-Type': 'application/json' },
                });
                setTypeWiseTodaySales(result.data.allTypesSalesData);
            } catch (error) {
                console.log(`Error fetching typewise sales data: ${error}`);
            }
        };
        fetchData();
    }, [])

    const data = typeWiseTodaySales
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, 3)
        .map(item => ({ category: item.subType, value: item.totalSales.toString() }));

    // const data = [
    //     {
    //         category: 'Chinese',
    //         value: '100'
    //     },
    //     {
    //         category: 'Burger',
    //         value: '80'
    //     },
    //     {
    //         category: 'Pizza',
    //         value: '75'
    //     },
    // ]

    return data
}

export const TopItemsSalesMonth = () => {
    const { userInfo } = useContext(AuthContext);

    const data = [
        {
            item: 'Egg Roll',
            value: '200'
        },
        {
            item: 'Salad',
            value: '150'
        },
        {
            item: 'Sandwich',
            value: '100'
        },
    ]

    return data
}

export const TopItemsSalesToday = () => {
    const { userInfo } = useContext(AuthContext);

    const data = [
        {
            item: 'Egg Roll',
            value: '100'
        },
        {
            item: 'Salad',
            value: '80'
        },
        {
            item: 'Sandwich',
            value: '65'
        },
    ]

    return data
}

