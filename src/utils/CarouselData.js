import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext'
import client from './ApiConfig'

export const TopRecipesCarouselData = () => {
    const { userInfo } = useContext(AuthContext);
    const [recipesSales, setRecipesSales] = useState([])

    const getWeeksRecipesSales = async () => {
        try {
            const currentDate = new Date();
            const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            const data = {
                tenantId: userInfo.user.tenant,
                startDate: startOfWeek,
                endDate: endOfWeek,
            };
            const result = await client.post('/get-recipewise-sales', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            setRecipesSales(result.data.allRecipesSalesData)
        } catch (err) {
            console.log(`Getting live data error ${err}`);
        }
    }

    useEffect(() => {
        getWeeksRecipesSales()
    }, []);

    const recipesSalesNotZero = recipesSales.filter(recipe => recipe.totalSales > 0);

    const topMarginRecipes = recipesSalesNotZero
        .sort((a, b) => a.totalProfitWmc - b.totalProfitWmc)
        .slice(0, 5);

    const topMargin = topMarginRecipes.map(recipe => ({
        title: recipe.name,
        image: recipe.imageUrl,
    }));

    const topSalesRecipes = recipesSalesNotZero
        .sort((a, b) => a.totalSales - b.totalSales)
        .slice(0, 5);

    const topSales = topSalesRecipes.map(recipe => ({
        title: recipe.name,
        image: recipe.imageUrl,
    }));

    const data = {
        topMargin,
        topSales
    }

    return data
}

export const TopTypesCarouselData = () => {
    const { userInfo } = useContext(AuthContext);
    const [typesSales, setTypesSales] = useState([])

    const getWeeksTypeWiseSales = async () => {
        try {
            const currentDate = new Date();
            const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            const data = {
                tenantId: userInfo.user.tenant,
                startDate: startOfWeek,
                endDate: endOfWeek,
            };
            const result = await client.post('/get-typewise-sales', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            setTypesSales(result.data.allTypesSalesData)
        } catch (err) {
            console.log(`Getting live data error ${err}`);
        }
    }

    useEffect(() => {
        getWeeksTypeWiseSales()
    }, []);

    const typesSalesNotZero = typesSales.filter(type => type.totalSales > 0);

    const topMarginTypes = typesSalesNotZero
        .sort((a, b) => a.totalProfitWmc - b.totalProfitWmc)
        .slice(0, 5);

    const topMargin = topMarginTypes.map(type => ({
        title: type.type,
        image: type.imageUrl,
    }));

    const topSalesTypes = typesSalesNotZero
        .sort((a, b) => a.totalSales - b.totalSales)
        .slice(0, 5);

    const topSales = topSalesTypes.map(type => ({
        title: type.type,
        image: type.imageUrl,
    }));

    const data = {
        topMargin,
        topSales
    }

    return data
}

export const TopVendorsCarouselData = () => {
    const { userInfo } = useContext(AuthContext);
    const [vendorsTotal, setVendorsTotal] = useState([])

    const getWeeksVendorsTotal = async () => {
        try {
            const currentDate = new Date();
            const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);;
            const data = {
                tenantId: userInfo.user.tenant,
                startDate: startOfWeek,
                endDate: endOfWeek,
            };
            const result = await client.post('/get-vendors-total', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            setVendorsTotal(result.data.vendorsTotal)
        } catch (err) {
            console.log(`Getting live data error ${err}`);
        }
    }

    useEffect(() => {
        getWeeksVendorsTotal()
    }, []);

    const topVendorsData = vendorsTotal
        .sort((a, b) => a.totalAmount - b.totalAmount)
        .slice(0, 5);

    const topVendors = topVendorsData.map(vendor => ({
        title: vendor.vendor,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdVv-gjmgoeUvXWKhZ-hDT_6mDPmMCkBCR6g&usqp=CAU'
    }));

    const data = {
        topVendors
    }

    return data
}

export const TopPurchasedIngredientsCarouselData = () => {
    const { userInfo } = useContext(AuthContext);
    const [ingredientsPurchase, setIngredientsPurchase] = useState([])

    const getWeeksIngredientsPurchaseData = async () => {
        try {
            const currentDate = new Date();
            const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            const data = {
                tenantId: userInfo.user.tenant,
                startDate: startOfWeek,
                endDate: endOfWeek,
            };
            const result = await client.post('/get-ingredients-total-purchase', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            setIngredientsPurchase(result.data.ingredientsTotal)
        } catch (err) {
            console.log(`Getting live data error ${err}`);
        }
    }

    useEffect(() => {
        getWeeksIngredientsPurchaseData()
    }, []);

    const topIngredientsData = ingredientsPurchase
        .sort((a, b) => a.totalAmount - b.totalAmount)
        .slice(0, 5);

    const topIngredients = topIngredientsData.map(ingredient => ({
        title: ingredient.ingredient,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTli5rwEZwfuQP4ZsYSRH431jLr9jULzPI8HA&usqp=CAU'
    }));

    const data = {
        topIngredients
    }

    return data
}   