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

    const data = [
        {
            category: 'Chinese',
            value: '200'
        },
        {
            category: 'Burger',
            value: '180'
        },
        {
            category: 'Pizza',
            value: '100'
        },
    ]

    return data
}

export const TopCategoriesSalesToday = () => {
    const { userInfo } = useContext(AuthContext);

    const data = [
        {
            category: 'Chinese',
            value: '100'
        },
        {
            category: 'Burger',
            value: '80'
        },
        {
            category: 'Pizza',
            value: '75'
        },
    ]

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

