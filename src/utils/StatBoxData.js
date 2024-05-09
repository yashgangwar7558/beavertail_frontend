import React, { useState, useContext, useEffect } from 'react';
import { PointOfSaleRounded, ReceiptRounded, MonetizationOnRounded, ShoppingCartRounded, SouthRounded, NorthRounded } from "@mui/icons-material";
import { AuthContext } from '../context/AuthContext'
import client from './ApiConfig'

import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

export const StatBoxData = (typeToggle) => {
    const { userInfo } = useContext(AuthContext);
    const [todaysData, setTodaysData] = useState({ totalSales: 0.00, totalExpense: 0.00, totalProfit: 0.00 });
    const [yesterdaysData, setYesterdayData] = useState({ totalSales: 0.00, totalExpense: 0.00, totalProfit: 0.00 });
    const [monthsData, setMonthsData] = useState({ totalSales: 0.00, totalExpense: 0.00, totalProfit: 0.00 });
    const [prevMonthsData, setPrevMonthsData] = useState({ totalSales: 0.00, totalExpense: 0.00, totalProfit: 0.00 });
    const [ordersFulfilled, setOrdersFulfilled] = useState(0);
    const [yesterdayOrdersFulfilled, setYesterdayOrdersFulfilled] = useState(0);
    const [itemsSold, setItemsSold] = useState(0);
    const [yesterdayItemsSold, setYesterdayItemsSold] = useState(0);

    const getTodaysData = async () => {
        try {
            const currentDate = new Date();
            const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
            const data = {
                tenantId: userInfo.user.tenant,
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

    const getYesterdaysData = async () => {
        try {
            const currentDate = new Date();
            const startOfPrevDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
            const endOfPrevDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            const data = {
                tenantId: userInfo.user.tenant,
                startDate: startOfPrevDay,
                endDate: endOfPrevDay,
            };
            const result = await client.post('/get-sales-expense-profit', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            setYesterdayData(result.data);
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
                tenantId: userInfo.user.tenant,
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

    const getPrevMonthsData = async () => {
        try {
            const currentDate = new Date();
            const startOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
            const endOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            const data = {
                tenantId: userInfo.user.tenant,
                startDate: startOfPrevMonth,
                endDate: endOfPrevMonth,
            };
            const result = await client.post('/get-sales-expense-profit', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            setPrevMonthsData(result.data);
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
                tenantId: userInfo.user.tenant,
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

    const getYesterdayOrdersFulfilled = async () => {
        try {
            const currentDate = new Date();
            const startOfPrevDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
            const endOfPrevDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            const data = {
                tenantId: userInfo.user.tenant,
                startDate: startOfPrevDay,
                endDate: endOfPrevDay,
            };
            const result = await client.post('/get-bills-count-bw-dates', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            setYesterdayOrdersFulfilled(result.data.countBills);
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
                tenantId: userInfo.user.tenant,
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

    const getYesterdayItemsSold = async () => {
        try {
            const currentDate = new Date();
            const startOfPrevDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
            const endOfPrevDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            const data = {
                tenantId: userInfo.user.tenant,
                startDate: startOfPrevDay,
                endDate: endOfPrevDay,
            };
            const result = await client.post('/get-items-sold', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            setYesterdayItemsSold(result.data.itemsSold);
        } catch (err) {
            console.log(`Getting live data error ${err}`);
        }
    };

    useEffect(() => {
        getTodaysData()
        getYesterdaysData()
        getMonthsData()
        getPrevMonthsData()
        getOrdersFulfilled()
        getYesterdayOrdersFulfilled()
        getItemsSold()
        getYesterdayItemsSold()
    }, []);

    const calculatePercentageChange = (previousValue, currentValue) => {
        if (previousValue == 0) {
            return currentValue != 0 ? `100` : `0`;
        }
        const change = ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
        return Math.abs(change).toFixed(0);
    };

    const data = [
        {
            title: todaysData.totalSales,
            subtitle: "Today's Sales",
            percentIcon: todaysData.totalSales >= yesterdaysData.totalSales ? <NorthRounded sx={{ color: '#1da32b', fontSize: '12px', stroke: "#1da32b", strokeWidth: 2 }} /> : <SouthRounded sx={{ color: '#b0192a', fontSize: '12px', stroke: "#b0192a", strokeWidth: 2 }} />,
            percentChange: calculatePercentageChange(yesterdaysData.totalSales, todaysData.totalSales),
            color: todaysData.totalSales >= yesterdaysData.totalSales ? '#1da32b' : '#b0192a',
            title1: monthsData.totalSales,
            subtitle1: "Month's Sales",
            percentIcon1: monthsData.totalSales >= prevMonthsData.totalSales ? <NorthRounded sx={{ color: '#1da32b', fontSize: '12px', stroke: "#1da32b", strokeWidth: 2 }} /> : <SouthRounded sx={{ color: '#b0192a', fontSize: '12px', stroke: "#b0192a", strokeWidth: 2 }} />,
            percentChange1: calculatePercentageChange(prevMonthsData.totalSales, monthsData.totalSales),
            color1: monthsData.totalSales >= prevMonthsData.totalSales ? '#1da32b' : '#b0192a',
            icon: <PointOfSaleOutlinedIcon sx={{ color: '#047c44', fontSize: '50px' }} />,
        },
        {
            title: todaysData.totalExpense,
            subtitle: "Today's Food Cost",
            percentIcon: todaysData.totalExpense >= yesterdaysData.totalExpense ? <NorthRounded sx={{ color: '#b0192a', fontSize: '12px', stroke: "#b0192a", strokeWidth: 2 }} /> : <SouthRounded sx={{ color: '#1da32b', fontSize: '12px', stroke: "#1da32b", strokeWidth: 2 }} />,
            percentChange: calculatePercentageChange(yesterdaysData.totalExpense, todaysData.totalExpense),
            color: todaysData.totalExpense >= yesterdaysData.totalExpense ? '#b0192a' : '#1da32b',
            title1: monthsData.totalExpense,
            subtitle1: "Month's Food Cost",
            percentIcon1: monthsData.totalExpense >= prevMonthsData.totalExpense ? <NorthRounded sx={{ color: '#b0192a', fontSize: '12px', stroke: "#b0192a", strokeWidth: 2 }} /> : <SouthRounded sx={{ color: '#1da32b', fontSize: '12px', stroke: "#1da32b", strokeWidth: 2 }} />,
            percentChange1: calculatePercentageChange(prevMonthsData.totalExpense, monthsData.totalExpense),
            color1: monthsData.totalExpense >= prevMonthsData.totalExpense ? '#b0192a' : '#1da32b',
            icon: <ReceiptOutlinedIcon sx={{ color: '#047c44', fontSize: '50px' }} />,
        },
        {
            title: todaysData.totalProfit,
            subtitle: "Today's Gross Profit",
            percentIcon: todaysData.totalProfit >= yesterdaysData.totalProfit ? <NorthRounded sx={{ color: '#1da32b', fontSize: '12px', stroke: "#1da32b", strokeWidth: 2 }} /> : <SouthRounded sx={{ color: '#b0192a', fontSize: '12px', stroke: "#b0192a", strokeWidth: 2 }} />,
            percentChange: calculatePercentageChange(yesterdaysData.totalProfit, todaysData.totalProfit),
            color: todaysData.totalProfit >= yesterdaysData.totalProfit ? '#1da32b' : '#b0192a',
            title1: monthsData.totalProfit,
            subtitle1: "Month's Gross Profit",
            percentIcon1: monthsData.totalProfit >= prevMonthsData.totalProfit ? <NorthRounded sx={{ color: '#1da32b', fontSize: '12px', stroke: "#1da32b", strokeWidth: 2 }} /> : <SouthRounded sx={{ color: '#b0192a', fontSize: '12px', stroke: "#b0192a", strokeWidth: 2 }} />,
            percentChange1: calculatePercentageChange(prevMonthsData.totalProfit, monthsData.totalProfit),
            color1: monthsData.totalProfit >= prevMonthsData.totalProfit ? '#1da32b' : '#b0192a',
            icon: <MonetizationOnOutlinedIcon sx={{ color: '#047c44', fontSize: '50px' }} />,
        },
        {
            title: ordersFulfilled,
            subtitle: 'Orders Fulfilled',
            percentIcon: ordersFulfilled >= yesterdayOrdersFulfilled ? <NorthRounded sx={{ color: '#1da32b', fontSize: '12px', stroke: "#1da32b", strokeWidth: 2 }} /> : <SouthRounded sx={{ color: '#b0192a', fontSize: '12px', stroke: "#b0192a", strokeWidth: 2 }} />,
            percentChange: calculatePercentageChange(yesterdayOrdersFulfilled, ordersFulfilled),
            color: ordersFulfilled >= yesterdayOrdersFulfilled ? '#1da32b' : '#b0192a',
            title1: itemsSold,
            subtitle1: 'Items Sold',
            x: yesterdayItemsSold,
            y: itemsSold,
            percentIcon1: itemsSold >= yesterdayItemsSold ? <NorthRounded sx={{ color: '#1da32b', fontSize: '12px', stroke: "#1da32b", strokeWidth: 2 }} /> : <SouthRounded sx={{ color: '#b0192a', fontSize: '12px', stroke: "#b0192a", strokeWidth: 2 }} />,
            percentChange1: calculatePercentageChange(yesterdayItemsSold, itemsSold),
            color1: itemsSold >= yesterdayItemsSold ? '#1da32b' : '#b0192a',
            icon: <ShoppingCartOutlinedIcon sx={{ color: '#047c44', fontSize: '50px' }} />,
        },
        // {
        //     title: `$ 220`,
        //     subtitle: 'Todays Sales',
        //     percentIcon: <NorthRounded sx={{ color: '#1da32b', fontSize: '12px', stroke: "#1da32b", strokeWidth: 2 }} />,
        //     percentChange: 10,
        //     color: '#1da32b',
        //     title1: `$ 2200`,
        //     subtitle1: 'Months Sales',
        //     percentIcon1: <NorthRounded sx={{ color: '#1da32b', fontSize: '12px', stroke: "#1da32b", strokeWidth: 2 }} />,
        //     percentChange1: 5,
        //     color1: '#1da32b',
        //     icon: <PointOfSaleOutlinedIcon sx={{ color: '#047c44', fontSize: '36px' }} />,
        // },
        // {
        //     title: `$ 20`,
        //     subtitle: 'Todays Food Cost',
        //     percentIcon: <NorthRounded sx={{ color: '#b0192a', fontSize: '12px', stroke: "#b0192a", strokeWidth: 2 }} />,
        //     percentChange: 10,
        //     color: '#b0192a',
        //     title1: `$ 1050`,
        //     subtitle1: 'Months Food Cost',
        //     percentIcon1: <NorthRounded sx={{ color: '#b0192a', fontSize: '12px', stroke: "#b0192a", strokeWidth: 2 }} />,
        //     percentChange1: 3,
        //     color1: '#b0192a',
        //     icon: <MonetizationOnOutlinedIcon sx={{ color: '#047c44', fontSize: '36px' }} />,
        // },
        // {
        //     title: `$ 50`,
        //     subtitle: 'Todays Gross Profit',
        //     percentIcon: <NorthRounded sx={{ color: '#1da32b', fontSize: '12px', stroke: "#1da32b", strokeWidth: 2 }} />,
        //     percentChange: 25,
        //     color: '#1da32b',
        //     title1: `$ 2000`,
        //     subtitle1: 'Months Gross Profit',
        //     percentIcon1: <NorthRounded sx={{ color: '#1da32b', fontSize: '12px', stroke: "#1da32b", strokeWidth: 2 }} />,
        //     percentChange1: 20,
        //     color1: '#1da32b',
        //     icon: <MonetizationOnRounded sx={{ color: '#047c44', fontSize: '36px' }} />,
        // },
        // {
        //     title: ordersFulfilled,
        //     subtitle: 'Orders Fulfilled',
        //     percentIcon: <SouthRounded sx={{ color: '#b0192a', fontSize: '12px', stroke: "#b0192a", strokeWidth: 2 }} />,
        //     percentChange: calculatePercentageChange(yesterdayOrdersFulfilled, ordersFulfilled),
        //     color: ordersFulfilled >= yesterdayOrdersFulfilled ? '#1da32b' : '#b0192a',
        //     title1: itemsSold,
        //     subtitle1: 'Items Sold',
        //     x: yesterdayItemsSold,
        //     y: itemsSold,
        //     percentIcon1: <SouthRounded sx={{ color: '#b0192a', fontSize: '12px', stroke: "#b0192a", strokeWidth: 2 }} />,
        //     percentChange1: calculatePercentageChange(yesterdayItemsSold, itemsSold),
        //     color1: itemsSold >= yesterdayItemsSold ? '#1da32b' : '#b0192a',
        //     icon: <ShoppingCartOutlinedIcon sx={{ color: '#047c44', fontSize: '36px' }} />,
        // },
    ];

    return data;
};
