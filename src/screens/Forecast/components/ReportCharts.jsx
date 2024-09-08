import React, { useState,useEffect } from 'react';
import CardFilter from './CardFilter';
import ForecastSalesChart from './ForecastSalesChart';
import OrdersChart from './OrdersChart';
import './ReportCharts.css';

function ReportCharts(props) {
  const [filter, setFilter] = useState('Daily');
  const handleFilterChange = filter => {
    setFilter(filter);
  };
  useEffect(()=>{
    if(props?.filter ){ setFilter(props?.filter);}
   
},[props?.filter]);


  return (
    <div className="charts-container">
      <div className="chart-item">
        <h6>Forecasted Sales | <span>{filter}</span></h6>
        <CardFilter filterChange={handleFilterChange} />
        <ForecastSalesChart filter={filter} />
      </div>
      <div className="chart-item">
        <h6>Forecasted Orders | <span>{filter}</span></h6>
        <CardFilter filterChange={handleFilterChange} />
        <OrdersChart filter={filter} />
      </div>
    </div>
  );
}

export default ReportCharts;


