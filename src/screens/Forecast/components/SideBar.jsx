import React from 'react';
import './SideBar.css';

function SideBar() {
  return (
  <aside id='sidebar' className='sidebar'>
        <ul className="sidebar-nav" id="sidebar-nav">
            <li className='nav-item'>
                <a className='nav-link' href='/'>
                    <i className='bi bi-graph-up-arrow'></i>
                    <span>Forecast</span>
                </a>
                </li>
                </ul>
    </aside>
  );
}

export default SideBar
