import React, { useState } from 'react';
import Chart from 'react-apexcharts';

function ForecastedSalesChart() {
  const [data, setData] = useState({
    series: [
      {
        name: 'Actual Sales',
        data: [310, 400, 280, 510, 420,600, 560, null, null, null, null], // Actual data
      },
      {
        name: 'Forecasted Sales',
        data: [null, null, null, null, null, null, 560, 609, 650, 709, 751], // Forecast data
      },
    ],
    options: {
      chart: {
        height: 410,
        type: 'area',
        toolbar: {
          show: false,
        },
      },
      markers: {
        size: 4,
      },
      colors: ['#4154f1', '#ff771d'], // Different colors for actual and forecast
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
        width: 2,
      },
      xaxis: {
        type: 'datetime',
        categories: [
          '2024-07-02 05:30:00 IST',
          '2024-07-04 05:30:00 IST',
          '2024-07-06 05:30:00 IST',
          '2024-07-08 05:30:00 IST',
          '2024-07-09 05:30:00 IST',
          '2024-07-11 05:30:00 IST',
          '2024-07-13 05:30:00 IST',
          '2024-07-15 05:30:00 IST',
          '2024-07-17 05:30:00 IST',
          '2024-07-19 05:30:00 IST',
          '2024-07-22 05:30:00 IST',
        ],
      },
      tooltip: {
        x: {
          format: 'yyyy/MM/dd HH:mm',
        },
        y: {
          formatter: function (value, { seriesIndex, dataPointIndex, w }) {
            // Check if the value is null
            if (w.config.series[seriesIndex].data[dataPointIndex] === null) {
              return ''; // Return an empty string if the value is null
            }
            // Otherwise, format the value with a dollar sign
            return "$" + value.toFixed(2);
          }
        }
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return "$" + value;
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
      forecastDataPoints: {
        count: 5, // Number of data points that are part of the forecast
        dashArray: 5, // Style for the forecast line
      },
    },
  });

  return (
    <Chart
      options={data.options}
      series={data.series}
      type={data.options.chart.type}
      height={data.options.chart.height}
    />
  );
}

export default ForecastedSalesChart;

