import React, { useState,useEffect } from 'react';
import ReportCharts from './ReportCharts';
import CategoryCharts from "./CategoryCharts";

function Category(props) {
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
          Category Reports 
        </h5>
        <CategoryCharts filter={filter} />
      </div>
    </div>
  );
}

export default Category;