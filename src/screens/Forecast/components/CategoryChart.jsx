import React, { useEffect, useRef, useState } from 'react';
import ApexCharts from 'apexcharts';
import dayjs from 'dayjs';

function CategoryChart({ filter }) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({ categories: [], series: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4001/cards1');
        const data = await response.json();

        // Get the date limit based on the selected filter
        let dateLimit;
        switch (filter) {
          case 'Daily':
            dateLimit = dayjs().subtract(1, 'day');
            break;
          case 'Weekly':
            dateLimit = dayjs().subtract(1, 'week');
            break;
          case 'Monthly':
            dateLimit = dayjs().subtract(1, 'month');
            break;
          case 'Yearly':
            dateLimit = dayjs().subtract(1, 'year');
            break;
          default:
            dateLimit = dayjs().subtract(1, 'day');
        }

        // Process the data
        const filteredData = data.filter(item =>
          dayjs(item.tranDdate).isAfter(dateLimit)
        );

        const categoryTotals = filteredData.reduce((acc, item) => {
          const category = item.category.toLowerCase(); // Normalize category name
          if (acc[category]) {
            acc[category] += item.quantitOfItems;
          } else {
            acc[category] = item.quantitOfItems;
          }
          return acc;
        }, {});

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
        const seriesData = categories.map(category => categoryTotals[category] || 0);

        // Update state with processed data
        setChartData({ categories, series: seriesData });
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
          height: 345,
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
            fontSize: '12px',
            colors: ['#fff']
          }
        },
        series: [
          {
            data: chartData.series
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

export default CategoryChart;




