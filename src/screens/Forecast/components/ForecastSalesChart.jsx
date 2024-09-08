import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import dayjs from 'dayjs';
import chartdata from '../api/csvjson_with_guests.json'

function ForecastSalesChart({ filter }) {
  const [data, setData] = useState({
    series: [
      {
        name: 'Actual Sales',
        data: [],
      },
      {
        name: 'Forecasted Sales',
        data: [],
      },
    ],
    options: {
      chart: {
        height: 300,
        type: 'area',
        toolbar: {
          show: false,
        },
      },
      markers: {
        size: 4,
      },
      colors: ['#4154f1', '#ff771d'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.4,
          stops: [0, 90, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: [2, 2],
        dashArray: [0, 5],
      },
      xaxis: {
        type: 'datetime',
        categories: [],
      },
      tooltip: {
        x: {
          format: filter === 'Weekly' ? 'yyyy/MM/DD' : 'yyyy/MM',
        },
        y: {
          formatter: function (value) {
            return value === null ? '' : "$" + value.toFixed(2);
          }
        }
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value === null ? '' : "$" + value;
          }
        }
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
        const rawData = chartdata.cards1

        const today = dayjs().startOf('day');
        const actualSales = new Map();
        const forecastedSales = new Map();
        const dates = new Set();

        rawData.forEach(item => {
          const orderDate = dayjs(item.tranDdate).startOf('day');
          const orderAmount = item.OrderAmount;
          const dateTime = filter === 'Weekly' ? orderDate.startOf('week').format('YYYY-MM-DD') :
            filter === 'Monthly' ? orderDate.startOf('month').format('YYYY-MM') : 
            orderDate.format('YYYY-MM-DD');

          if (orderDate.isBefore(today) || (orderDate.isSame(today) && dayjs().hour() >= 12)) {
            actualSales.set(dateTime, (actualSales.get(dateTime) || 0) + orderAmount);
          } else {
            forecastedSales.set(dateTime, (forecastedSales.get(dateTime) || 0) + orderAmount);
          }

          dates.add(dateTime);
        });

        const todayFormatted = filter === 'Weekly' ? today.startOf('week').format('YYYY-MM-DD') :
            filter === 'Monthly' ? today.startOf('month').format('YYYY-MM') : 
            today.format('YYYY-MM-DD');

        if (!dates.has(todayFormatted)) {
          if (dayjs().hour() >= 12) {
            actualSales.set(todayFormatted, (actualSales.get(todayFormatted) || 0));
          } else {
            forecastedSales.set(todayFormatted, (forecastedSales.get(todayFormatted) || 0));
          }
          dates.add(todayFormatted);
        }

        const sortedDates = Array.from(dates).sort((a, b) => new Date(a) - new Date(b));

        const recentActualSales = sortedDates
          .filter(date => date <= todayFormatted)
          .slice(-4);

        const upcomingForecastedSales = sortedDates
          .filter(date => date >= todayFormatted)
          .slice(0, 4);

        const filteredDates = [
          ...recentActualSales,
          todayFormatted,
          ...upcomingForecastedSales
        ].sort((a, b) => new Date(a) - new Date(b));

        const actualSalesValue = actualSales.get(todayFormatted) || forecastedSales.get(todayFormatted) || 0;
// Sort the actualSales map by date key (YYYY-MM-DD format)
const sortedActualSales = new Map(
  [...actualSales.entries()].sort((a, b) => a[0].localeCompare(b[0]))
);

// Sort the forecastedSales map by date key (YYYY-MM-DD format)
const sortedForecastedSales = new Map(
  [...forecastedSales.entries()].sort((a, b) => a[0].localeCompare(b[0]))
);

//******************************************* */
// Get the last 7 days of actual sales
const last7DaysActualSales = Array.from(sortedActualSales.values()).slice(-7);
const last7DaysSum = last7DaysActualSales.reduce((sum, value) => sum + value, 0);

// Fill actual sales for dates
const filledActualSales = filteredDates.map(date => {
  return [date, sortedActualSales.get(date) || (date === todayFormatted ? actualSalesValue : null)];
});

// Fill forecasted sales for the next 7 days based on the sum of the last 7 days
const filledForecastedSales = filteredDates.map((date, index) => {
  if (date === todayFormatted) {
    return [date, actualSalesValue]; // Match forecasted to actual for the current period
  }

  const actualValue = sortedActualSales.get(date);

  // Forecast the next 7 days based on the sum of the last 7 days
  if (actualValue === undefined && sortedForecastedSales.get(date) === 0) {
    const dayOffset = index - filteredDates.indexOf(todayFormatted);
    if (dayOffset > 0 && dayOffset <= 7) {
      return [date, last7DaysSum]; // Use the sum of the last 7 days' actual sales for forecasting
    }
  }

  return [date, sortedForecastedSales.get(date) || null];
});
//************* */

//         const sortedActualSales = new Map(
//           [...actualSales.entries()].sort((a, b) => a[0].localeCompare(b[0]))
//         );

//         const filledActualSales = filteredDates.map(date => [date, sortedActualSales.get(date) || (date === todayFormatted ? actualSalesValue : null)]);
       
       

//         const sortedForecastedSales = new Map(
//           [...forecastedSales.entries()].sort((a, b) => a[0].localeCompare(b[0]))
//         );
//         const lastActualSales = Array.from(sortedActualSales.values()).slice(-1)[0] || 100; // Use last known actual sales or default to 100

// // Forecast logic for the next 7 days based on last actual sales (you can adjust this logic as needed)
// const forecastNext7Days = (dayOffset) => {
//   const growthRate = 1.05; // Example: 5% growth per day
//   return lastActualSales * Math.pow(growthRate, dayOffset); // Forecast sales with 5% daily growth
// };

//   const actualValue = sortedActualSales.get(date);
  
//   // Forecast the next 7 days based on actual sales
//   if (actualValue === undefined && sortedForecastedSales.get(date) === 0) {
//     const dayOffset = index - filteredDates.indexOf(todayFormatted);
//     if (dayOffset > 0 && dayOffset <= 7) {
//       return [date, forecastNext7Days(dayOffset)]; // Forecast for the next 7 days
//     }
//   }

//   return [date, sortedForecastedSales.get(date) || null];
        // Calculate the range for forecasted sales based on actual sales ±10%
        // const filledForecastedSales = filteredDates.map(date => {
        //   if (date === todayFormatted) {
        //     return [date, actualSalesValue]; // Match forecasted to actual for the current period
        //   }
        //   const actualValue = sortedActualSales.get(date);
        //   if (actualValue !== undefined && sortedForecastedSales.get(date) === 0) {
        //     // Set forecasted sales to ±10% of actual sales
        //     // const lowerBound = actualValue * 0.9;
        //     // const upperBound = actualValue * 1.1;
        //     return [date, actualValue]; // Use the midpoint for display
        //   }
        //   return [date, sortedForecastedSales.get(date) || null];
        // });

        setData({
          series: [
            {
              name: 'Actual Sales',
              data: filledActualSales,
            },
            {
              name: 'Forecasted Sales',
              data: filledForecastedSales,
            },
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

export default ForecastSalesChart;













