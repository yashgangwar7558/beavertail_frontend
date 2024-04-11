import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext'
import client from './ApiConfig'

export const LineChartHeaderData = () => {
  const { userInfo } = useContext(AuthContext);
  const [yearlyData, setYearlyData] = useState({ totalSales: 0, totalExpense: 0, totalProfit: 0 })

  const getYearlyData = async () => {
    try {
      const currentDate = new Date();
      const startOfPastYear = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1);
      const endOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const data = {
        tenantId: userInfo.user.tenant,
        startDate: startOfPastYear,
        endDate: endOfCurrentMonth,
      };
      const result = await client.post('/get-sales-expense-profit', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      setYearlyData(result.data)
    } catch (err) {
      console.log(`Getting live data error ${err}`);
    }
  }

  useEffect(() => {
    getYearlyData()
  }, []);

  const data = [
    // {
    //   title: 'Total Revenue',
    //   subtitle: `$ ${(yearlyData.totalSales)}`,
    // },
    // {
    //   title: 'Total Expense',
    //   subtitle: `$ ${(yearlyData.totalExpense)}`,
    // },
    // {
    //   title: 'Total Profit',
    //   subtitle: `$ ${(yearlyData.totalProfit)}`,
    // },
    {
      title: 'Total Revenue',
      subtitle: `$ 4400`,
    },
    {
      title: 'Total Expense',
      subtitle: `$ 3800`,
    },
    {
      title: 'Total Profit',
      subtitle: `$ 600`,
    },
  ]

  return data
}


export const LineChartData = () => {
  const { userInfo } = useContext(AuthContext);
  const [monthWiseData, setMonthWiseData] = useState([])

  const getMonthlyData = async () => {
    try {
      const currentDate = new Date();
      const startOfPastYear = new Date(currentDate.getFullYear() - 1, currentDate.getMonth() + 1, 1);
      const endOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const data = {
        tenantId: userInfo.user.tenant,
        startDate: startOfPastYear,
        endDate: endOfCurrentMonth,
      };
      const result = await client.post('/get-monthwise-sales-expense-profit', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      setMonthWiseData(result.data.monthWiseData)
    } catch (err) {
      console.log(`Getting live data error ${err}`);
    }
  }

  useEffect(() => {
    getMonthlyData()
  }, []);

  const expenseData = monthWiseData.map(item => ({
    x: item.month,
    y: item.totalExpense,
  }));

  const revenueData = monthWiseData.map(item => ({
    x: item.month,
    y: item.totalSales,
  }));

  const data = [
    {
      "id": "Expense",
      "color": "hsl(84, 70%, 50%)",
      "data": expenseData
    },
    {
      "id": "Revenue",
      "color": "hsl(142, 70%, 50%)",
      "data": revenueData
    }
  ]

  return data
}


export const BarChartData = () => {
  const { userInfo } = useContext(AuthContext);
  const [monthWiseData, setMonthWiseData] = useState([])

  const getMonthlyData = async () => {
    try {
      const currentDate = new Date();
      const startOfPastYear = new Date(currentDate.getFullYear() - 1, currentDate.getMonth() + 1, 1);
      const endOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const data = {
        tenantId: userInfo.user.tenant,
        startDate: startOfPastYear,
        endDate: endOfCurrentMonth,
      };
      const result = await client.post('/get-monthwise-type-sales', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      setMonthWiseData(result.data.monthWiseSalesData)
    } catch (err) {
      console.log(`Getting live data error ${err}`);
    }
  }

  useEffect(() => {
    getMonthlyData()
  }, []);

  const data = monthWiseData.map(({ month, salesData }) => {
    const monthlyData = {
      month: month,
    };

    monthlyData[`month`] = month
    salesData.forEach(({ type, totalProfitWmc }) => {
      monthlyData[`${type}`] = totalProfitWmc.toFixed(2);
      // monthlyData[`${type}Color`] = getColor(type);
    });

    return monthlyData;
  })

  return data
}

export const RecipeTypes = async () => {
  const { userInfo } = useContext(AuthContext);
  const [types, setTypes] = useState([])

  const getRecipeTypes = async () => {
    try {
      const data = {
        tenantId: userInfo.user.tenant,
      };
      const result = await client.post('/get-types', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      setTypes(result.data.types)
    } catch (err) {
      console.log(`Getting live data error ${err}`);
    }
  }

  useEffect(() => {
    getRecipeTypes()
  }, []);

  const data = types.map((item) => item.type)
  return data
}



