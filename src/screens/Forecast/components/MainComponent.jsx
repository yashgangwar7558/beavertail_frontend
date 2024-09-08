import React, { useState } from 'react';
import PageTitle from './PageTitle';
import Card from './Card';
import CardFilter from './CardFilter';

function MainComponent() {
  const [filter, setFilter] = useState('Daily');

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div>
      <PageTitle filter={filter} onFilterChange={handleFilterChange} />
      <div className="cards">
        <Card filter={filter} onFilterChange={handleFilterChange} />
        <Card filter={filter} onFilterChange={handleFilterChange} />
        {/* Add more cards as needed */}
      </div>
    </div>
  );
}

export default MainComponent;
