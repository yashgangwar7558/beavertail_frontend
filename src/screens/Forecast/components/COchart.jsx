import React, { useEffect, useRef, useState } from 'react';
import ApexCharts from 'apexcharts';
import dayjs from 'dayjs';
import chartdata from '../api/csvjson_with_guests.json'

function COchart({ filter }) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({ categories: [], actualOrders: [], forecastedOrders: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch('http://localhost:4001/cards1');
        const data = chartdata.cards1

        // Determine the date limits based on the selected filter
        let pastLimit, futureLimit;
        const today = dayjs();

        switch (filter) {
          case 'Daily':
            pastLimit = today.subtract(1, 'day');
            futureLimit = today.add(1, 'day');
            break;
          case 'Weekly':
            pastLimit = today.subtract(7, 'days');
            futureLimit = today.add(7, 'days');
            break;
          case 'Monthly':
            pastLimit = today.subtract(30, 'days');
            futureLimit = today.add(30, 'days');
            break;
          case 'Yearly':
            pastLimit = today.subtract(1, 'year');
            futureLimit = today.add(1, 'year');
            break;
          default:
            pastLimit = today.subtract(1, 'day');
            futureLimit = today.add(1, 'day');
        }

        // Process the data
        const categoryTotals = data.reduce(
          (acc, item) => {
            const category = item.category.toLowerCase(); // Normalize category name
            const orderDate = dayjs(item.tranDdate);

            // Categorize as actual or forecasted based on the date
            if (orderDate.isBefore(today) || orderDate.isSame(today, 'day')) {
              if (orderDate.isAfter(pastLimit)) {
                acc.actualOrders[category] = (acc.actualOrders[category] || 0) + item.quantitOfItems;
              }
            } else if (orderDate.isBefore(futureLimit)) {
              acc.forecastedOrders[category] = (acc.forecastedOrders[category] || 0) + item.quantitOfItems;
            }

            return acc;
          },
          { actualOrders: {}, forecastedOrders: {} }
        );

        // Define all possible categories and set default values if missing
        const allCategories = [
          'starters',
          'drinks',
          'salads',
          'entrees',
          'burger sandwiches',
          'comfort food',
          'sides',
          'desserts'
        ];

        const categories = allCategories;
        const actualOrdersData = categories.map(category => categoryTotals.actualOrders[category] || 0);
        const forecastedOrdersData = categories.map(category => categoryTotals.forecastedOrders[category] || 0);

        // Update state with processed data
        setChartData({ categories, actualOrders: actualOrdersData, forecastedOrders: forecastedOrdersData });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [filter]); // Re-run the effect when filter changes

  useEffect(() => {
    if (chartRef.current && chartData.categories.length > 0) {
      const options = {
        chart: {
          type: 'bar',
          height: 250,
          stacked: true,
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              position: 'top'
            }
          }
        },
        dataLabels: {
          enabled: true,
          offsetX: -6,
          style: {
            fontSize: '8px',
            colors: ['#fff']
          }
        },
        series: [
          {
            name: 'Actual Orders',
            data: chartData.actualOrders,
            color: '#2eca6a' // Customize the color for actual orders
          },
          {
            name: 'Forecasted Orders',
            data: chartData.forecastedOrders,
            color: '#ff4d4d' // Customize the color for forecasted orders
          }
        ],
        xaxis: {
          categories: chartData.categories,
          title: {
            text: 'Orders'
          }
        },
        yaxis: {
          title: {
            text: 'Categories'
          }
        }
      };

      const chart = new ApexCharts(chartRef.current, options);
      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, [chartData]);

  return <div ref={chartRef} />;
}

export default COchart;


