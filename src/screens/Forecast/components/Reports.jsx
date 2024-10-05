import React, { useState,useEffect } from 'react';
import ReportCharts from './ReportCharts';
import './Reports.css'
function Reports(props) {
  const [filter, setFilter] = useState('Daily');
  const handleFilterChange = filter => {
    setFilter(filter);
  };
  useEffect(()=>{
    if(props?.filter ){ setFilter(props?.filter);}
   
},[props?.filter]);


  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">
          Sales Reports 
        </h5>
        <ReportCharts filter={filter} />
      </div>
    </div>
  );
}

export default Reports;

