import React, { useState } from 'react';
import CardFilter from './CardFilter';
import CategoryChart from './CategoryChart';

function CategoryWise() {
  const [filter, setFilter] = useState('Daily');
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="card">
      <CardFilter filterChange={handleFilterChange} />
      <div className="card-body pb-0">
        <h5 className="card-title">
          Category Report <span>| {filter}</span>
        </h5>
        <CategoryChart filter={filter} />
      </div>
    </div>
  );
}

export default CategoryWise;

