import React, { useState, useContext, useEffect } from 'react';
import { PointOfSaleRounded, ReceiptRounded, MonetizationOnRounded, ShoppingCartRounded } from "@mui/icons-material";
import { AuthContext } from '../context/AuthContext'
import client from './ApiConfig'

export const StatBoxData = () => {
    const { userInfo } = useContext(AuthContext);
    const [todaysData, setTodaysData] = useState({totalSales: 0, totalExpense: 0, totalProfit: 0});
    const [monthsData, setMonthsData] = useState({totalSales: 0, totalExpense: 0, totalProfit: 0});
    const [ordersFulfilled, setOrdersFulfilled] = useState(0);
    const [itemsSold, setItemsSold] = useState(0);

    const getTodaysData = async () => {
        try {
            const currentDate = new Date();
            const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
            const data = {
                userId: userInfo.user.userId,
                startDate: startOfDay,
                endDate: endOfDay,
            };
            const result = await client.post('/get-sales-expense-profit', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            setTodaysData(result.data);
        } catch (err) {
            console.log(`Getting live data error ${err}`);
        }
    };

    const getMonthsData = async () => {
        try {
            const currentDate = new Date();
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            const data = {
                userId: userInfo.user.userId,
                startDate: startOfMonth,
                endDate: endOfMonth,
            };
            const result = await client.post('/get-sales-expense-profit', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            setMonthsData(result.data);
        } catch (err) {
            console.log(`Getting live data error ${err}`);
        }
    };

    const getOrdersFulfilled = async () => {
        try {
            const currentDate = new Date();
            const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
            const data = {
                userId: userInfo.user.userId,
                startDate: startOfDay,
                endDate: endOfDay,
            };
            const result = await client.post('/get-bills-count-bw-dates', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            setOrdersFulfilled(result.data.countBills);
        } catch (err) {
            console.log(`Getting live data error ${err}`);
        }
    };

    const getItemsSold = async () => {
        try {
            const currentDate = new Date();
            const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
            const data = {
                userId: userInfo.user.userId,
                startDate: startOfDay,
                endDate: endOfDay,
            };
            const result = await client.post('/get-items-sold', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            setItemsSold(result.data.itemsSold);
        } catch (err) {
            console.log(`Getting live data error ${err}`);
        }
    };

    useEffect(() => {
        getTodaysData()
        getMonthsData()
        getOrdersFulfilled()
        getItemsSold()
    }, []);

    const data = [
        {
            title: `$ ${(todaysData.totalSales)}`,
            subtitle: 'Todays Sales',
            title1: `$ ${(monthsData.totalSales)}`,
            subtitle1: 'Months Sales',
            progress: '0.75',
            icon: <PointOfSaleRounded sx={{ color: '#047c44', fontSize: '36px' }} />,
        },
        {
            title: `$ ${todaysData.totalProfit}`,
            subtitle: 'Todays Profit',
            title1: `$ ${monthsData.totalProfit}`,
            subtitle1: 'Months Profit',
            progress: '0.89',
            icon: <MonetizationOnRounded sx={{ color: '#047c44', fontSize: '36px' }} />,
        },
        {
            title: `$ ${todaysData.totalExpense}`,
            subtitle: 'Todays Expense',
            title1: `$ ${monthsData.totalExpense}`,
            subtitle1: 'Months Expense',
            progress: '0.42',
            icon: <ReceiptRounded sx={{ color: '#047c44', fontSize: '36px' }} />,
        },
        {
            title: ordersFulfilled,
            subtitle: 'Orders Fulfilled',
            title1: itemsSold,
            subtitle1: 'Items Sold',
            progress: '0.50',
            icon: <ShoppingCartRounded sx={{ color: '#047c44', fontSize: '36px' }} />,
        },
    ];

    return data;
};
