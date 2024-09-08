import React from 'react'

function CardFilter({filterChange}) {
  return (
    <div className="filter">
        <a href="#" className="icon" data-bs-toggle="dropdown">
            <i className="bi bi-three-dots"></i>
        </a>
        <ul className='dropdown-menu dropdown-menu-end dropdown-menu-arrow'>
            <li className='dropdown-header text-start'>
                <h6>Filter</h6>
            </li>
            <li>
                <a className='dropdown-item' onClick={() => filterChange('Daily')}>
                    Daily
                </a>
            </li>
            <li>
                <a className='dropdown-item' onClick={() => filterChange('Weekly')}>
                    Weekly
                </a>
            </li>
            <li>
                <a className='dropdown-item' onClick={() => filterChange('Monthly')}>
                    Monthly
                </a>
            </li>
            {/* <li>
                <a className='dropdown-item' onClick={() => filterChange('Custom')}>
                    Custom
                </a>
            </li> */}
        </ul>
    </div>
  )
}

export default CardFilter
