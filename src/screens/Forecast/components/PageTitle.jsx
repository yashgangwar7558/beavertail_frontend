import React, { useState } from 'react';
// import { DateRangePicker } from 'react-date-range';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
// import 'react-date-range/dist/styles.css'; // Main style file
// import 'react-date-range/dist/theme/default.css'; // Theme CSS file
import './PageTitle.css';
import './Dashboard'
import Dashboard from './Dashboard';
 
function PageTitle({ page }) {
  const [falseState,setFalseState]= useState(false);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [filter,setFilter] = useState("Daily");
  // const handleButtonClick = () =>{
  //   setFilter()
  // }
  return (
    <div className="pagetitle">
      <div className="controls">
        {/* <h1 className="page-title">{page}</h1> */}
        <div className="button-group">
          <button className="btn btn-daily" value="Daily" onClick={(evt) => {
             setFilter(evt.target.value)
            }}>Daily</button>
          <button className="btn btn-weekly" value="Weekly" onClick={(evt) => {
             setFilter(evt.target.value)
            }}>Weekly</button> 
          <button className="btn btn-monthly" value="Monthly" onClick={(evt) => {
             setFilter(evt.target.value)
            }}>Monthly</button>
          {/* <DropdownButton id="dropdown-basic-button" title="Custom" className="custom-dropdown">
            <Dropdown.Item as="div">
              <DateRangePicker
                ranges={state}
                onChange={item => {setState([item.selection]);
                  setFilter(item.selection)}}
                moveRangeOnFirstSelection={false}
              />
            </Dropdown.Item>
          </DropdownButton> */}
        </div>
      </div>
      {/* <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/">
              <i className="bi bi-graph-up-arrow"></i>
            </a>
          </li>
          <li className="breadcrumb-item active">{page}</li>
        </ol>
      </nav> */}
      { <Dashboard filter={ filter || ""}/>}
    </div>
  );
}

export default PageTitle;





