import React, { useEffect, useRef, useState } from 'react';
import ApexCharts from 'apexcharts';
import dayjs from 'dayjs';
import chartdata from '../api/csvjson_with_guests.json'

function CFchart({ filter }) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({ categories: [], actualSales: [], forecastedSales: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch('http://localhost:4001/cards1');
        const data = chartdata.cards1

        // Determine the date limits for actual and forecasted sales based on the filter
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
          default:
            pastLimit = today.subtract(1, 'day');
            futureLimit = today.add(1, 'day');
        }

        // Process the data
        const categoryTotals = data.reduce(
          (acc, item) => {
            const category = item.category.toLowerCase(); // Normalize category name
            const orderDate = dayjs(item.tranDdate);
            const orderAmount = item.OrderAmount;

            // Categorize as actual or forecasted sales
            if (orderDate.isBefore(today) || orderDate.isSame(today, 'day')) {
              if (orderDate.isAfter(pastLimit)) {
                acc.actualSales[category] = (acc.actualSales[category] || 0) + orderAmount;
              }
            } else if (orderDate.isBefore(futureLimit)) {
              acc.forecastedSales[category] = (acc.forecastedSales[category] || 0) + orderAmount;
            }

            return acc;
          },
          { actualSales: {}, forecastedSales: {} }
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
        const actualSalesData = categories.map(category => categoryTotals.actualSales[category] || 0);
        const forecastedSalesData = categories.map(category => categoryTotals.forecastedSales[category] || 0);

        // Update state with processed data
        setChartData({ categories, actualSales: actualSalesData, forecastedSales: forecastedSalesData });
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
          height: 320,
          stacked: true, // Enable stacked bars
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: true, // Horizontal stacked bar
            dataLabels: {
              position: 'top'
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (value) {
            return `$${value.toFixed(2)}`; // Format values with $ and two decimals
          },
          offsetX: -6,
          style: {
            fontSize: '12px',
            colors: ['#fff']
          }
        },
        tooltip: {
          y: {
            formatter: function (value) {
              return `$${value.toFixed(2)}`; // Format tooltip values with $ and two decimals
            }
          }
        },
        series: [
          {
            name: 'Actual Sales',
            data: chartData.actualSales,
            color: '#4154f1' // Customize the color for actual sales
          },
          {
            name: 'Forecasted Sales',
            data: chartData.forecastedSales,
            color: '#ff771d' // Customize the color for forecasted sales
          }
        ],
        xaxis: {
          categories: chartData.categories,
          title: {
            text: 'Sales Amount'
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

export default CFchart;


