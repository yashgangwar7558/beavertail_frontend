import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext'
import client from './ApiConfig'

export const TopRecipesCarouselData = () => {
    const { userInfo } = useContext(AuthContext);
    const [recipesSales, setRecipesSales] = useState([])

    const getWeeksRecipesSales = async () => {
        try {
            const currentDate = new Date();
            const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
            const endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (6 - currentDate.getDay()))
            const data = {
                userId: userInfo.user.userId,
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
            const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
            const endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (6 - currentDate.getDay()))
            const data = {
                userId: userInfo.user.userId,
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