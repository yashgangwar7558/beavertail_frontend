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
    {
      title: 'Revenue',
      subtitle: `$ ${(yearlyData.totalSales)}`,
    },
    {
      title: 'Food Cost',
      subtitle: `$ ${(yearlyData.totalExpense)}`,
    },
    {
      title: 'Gross Profit',
      subtitle: `$ ${(yearlyData.totalProfit)}`,
    },
    // {
    //   title: 'Total Revenue',
    //   subtitle: `$ 4400`,
    // },
    // {
    //   title: 'Total Expense',
    //   subtitle: `$ 3800`,
    // },
    // {
    //   title: 'Total Profit',
    //   subtitle: `$ 600`,
    // },
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
      "id": "Food Cost",
      "color": "hsl(0, 100%, 50%)",
      "data": expenseData
    },
    {
      "id": "Revenue",
      "color": "hsl(199, 100%, 50%)",
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

  // const data = monthWiseData.map(({ month, salesData }) => {
  //   const monthlyData = {
  //     month: month,
  //   };

  //   monthlyData[`month`] = month
  //   salesData.forEach(({ type, totalProfitWmc }) => {
  //     monthlyData[`${type}`] = totalProfitWmc.toFixed(2);
  //     // monthlyData[`${type}Color`] = getColor(type);
  //   });

  //   return monthlyData;
  // })

  const data = [
    {
      "month": "Apr-23",
      "Food": 92,
      "Beverages": 50
    },
    {
      "month": "May-23",
      "Food": 40,
      "Beverages": 80
    },
    {
      "month": "June-23",
      "Food": 65,
      "Beverages": 50
    },
    {
      "month": "July-23",
      "Food": 80,
      "Beverages": 60
    },
    {
      "month": "Aug-23",
      "Food": 50,
      "Beverages": 68
    },
    {
      "month": "Sept-23",
      "Food": 92,
      "Beverages": 50
    },
    {
      "month": "Oct-23",
      "Food": 92,
      "Beverages": 70
    },
    {
      "month": "Nov-23",
      "Food": 80,
      "Beverages": 50
    },
    {
      "month": "Dec-23",
      "Food": 45,
      "Beverages": 58
    },
    {
      "month": "Jan-23",
      "Food": 86,
      "Beverages": 45
    },
    {
      "month": "Feb-23",
      "Food": 78,
      "Beverages": 65
    },
    {
      "month": "Mar-23",
      "Food": 100,
      "Beverages": 50
    },
  ]

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



