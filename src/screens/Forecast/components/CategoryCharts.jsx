import React, { useState,useEffect } from 'react';
import CardFilter from './CardFilter';
import './ReportCharts.css';
import COchart from "./COchart"
import CFchart from "./CFchart"

function CategoryCharts(props) {
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
        <h6>Category Sales | <span>{filter}</span></h6>
        <CardFilter filterChange={handleFilterChange} />
        <CFchart filter={filter} />
      </div>
      <div className="chart-item">
        <h6>Category Orders | <span>{filter}</span></h6>
        <CardFilter filterChange={handleFilterChange} />
        <COchart filter={filter} />
      </div>
    </div>
  );
}

export default CategoryCharts;