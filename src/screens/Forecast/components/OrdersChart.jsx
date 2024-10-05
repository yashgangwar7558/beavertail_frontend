import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import dayjs from 'dayjs';
import chartdata from '../api/csvjson_with_guests.json'

function OrdersChart({ filter }) {
  const [data, setData] = useState({
    series: [
      { name: 'Actual Orders', data: [] },
      { name: 'Forecasted Orders', data: [] },
    ],
    options: {
      chart: {
        height: 200,
        type: 'area',
        toolbar: { show: false },
      },
      markers: { size: 4 },
      colors: ['#2eca6a', '#ff4d4d'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.4,
          stops: [0, 90, 100],
        },
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: [2, 2], dashArray: [0, 5] },
      xaxis: {
        type: 'datetime',
        categories: [],
      },
      tooltip: {
        x: {
          format: filter === 'Weekly' ? 'yyyy/MM/DD' : 'yyyy/MM',
        },
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch('http://localhost:4001/cards1');
        const orders = chartdata.cards1

        const today = dayjs().startOf('day');
        const actualOrders = new Map();
        const forecastedOrders = new Map();
        const dates = new Set();

        orders.forEach(order => {
          const orderDate = dayjs(order.tranDdate).startOf('day');
          const dateTime = filter === 'Weekly'
            ? orderDate.startOf('week').format('YYYY-MM-DD')
            : filter === 'Monthly'
              ? orderDate.startOf('month').format('YYYY-MM')
              : orderDate.format('YYYY-MM-DD');

          if (orderDate.isBefore(today) || (orderDate.isSame(today) && dayjs().hour() >= 12)) {
            actualOrders.set(dateTime, (actualOrders.get(dateTime) || 0) + 1);
          } else {
            forecastedOrders.set(dateTime, (forecastedOrders.get(dateTime) || 0) + 1);
          }

          dates.add(dateTime);
        });

        const todayFormatted = filter === 'Weekly'
          ? today.startOf('week').format('YYYY-MM-DD')
          : filter === 'Monthly'
            ? today.startOf('month').format('YYYY-MM')
            : today.format('YYYY-MM-DD');

        if (!dates.has(todayFormatted)) {
          if (dayjs().hour() >= 12) {
            actualOrders.set(todayFormatted, (actualOrders.get(todayFormatted) || 0));
          } else {
            forecastedOrders.set(todayFormatted, (forecastedOrders.get(todayFormatted) || 0));
          }
          dates.add(todayFormatted);
        }

        const sortedDates = Array.from(dates).sort((a, b) => new Date(a) - new Date(b));

        const recentActualOrders = sortedDates
          .filter(date => date <= todayFormatted)
          .slice(-4);

        const upcomingForecastedOrders = sortedDates
          .filter(date => date >= todayFormatted)
          .slice(0, 4);

        const filteredDates = [
          ...recentActualOrders,
          todayFormatted,
          ...upcomingForecastedOrders,
        ].sort((a, b) => new Date(a) - new Date(b));

        const actualOrdersValue = actualOrders.get(todayFormatted) || forecastedOrders.get(todayFormatted) || 0;

        const filledActualOrders = filteredDates.map(date => [
          date, actualOrders.get(date) || (date === todayFormatted ? actualOrdersValue : null)
        ]);

        const filledForecastedOrders = filteredDates.map(date => {
          if (date === todayFormatted) {
            return [date, actualOrdersValue];
          }
          return [date, forecastedOrders.get(date) || null];
        });

        setData({
          series: [
            { name: 'Actual Orders', data: filledActualOrders },
            { name: 'Forecasted Orders', data: filledForecastedOrders },
          ],
          options: {
            ...data.options,
            xaxis: {
              ...data.options.xaxis,
              categories: filteredDates,
            },
          },
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [filter]);

  return (
    <Chart
      options={data.options}
      series={data.series}
      type={data.options.chart.type}
      height={data.options.chart.height}
    />
  );
}

export default OrdersChart;



