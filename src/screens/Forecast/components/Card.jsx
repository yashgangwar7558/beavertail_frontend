import React, { useState } from 'react'
import CardFilter from './CardFilter';
import ForecastedSalesCard from './ForecastedSalesCard'
import OrdersCard from './OrdersCard';
import GuestsCard from './GuestsCard';
import './card.css'

function Card({card}) {

    const [filter,setFilter]=useState('Daily');
    const handleFilterChange=filter => {
        setFilter(filter);
    };

    const forecastcard = {
        "_id": 1,
        "name": "Forecasted Sales",
        "icon": "bi bi-coin",
        "amount": 3246,
        "percentage": 0.12,
        "active": true,
        "id": "5858"
    };

    const ordercard = {
        "_id": 2,
        "name": "Orders",
        "icon": "bi bi-cart",
        "amount": 145,
        "percentage": 0.08,
        "active": false,
        "id": "275d"
    };

    const guestcard = {
        "_id": 3,
        "name": "Guests",
        "icon": "bi bi-people",
        "amount": 1244,
        "percentage": -0.11,
        "active": false,
        "id": "3a28"
    };
    
  return (
    <div className="col-xxl-4 col-md-6">
        <div className="card info-card sales-card">
            <CardFilter filterChange={handleFilterChange}/>
            <div className="card-body">
                {/* <h5 className="card-title">
                    {card.name}<span>|{filter}</span>
                </h5> */}
                {/* <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                        <i className={card.icon}></i>
                    </div>
                    <div className="ps-3">
                        <h6>
                            {card.name ==='Forecasted Sales'
                            ? '$' + card.amount.toLocaleString('en-US')
                            : card.amount.toLocaleString('en-US')}
                        </h6>
                        <span
                            className={`${
                                card.percentage>0?'text-success':'text-danger'
                            } small pt-1 fw-bold`}>
                                {card.percentage>0
                                ? card.percentage * 100
                                : -card.percentage*100}
                            %
                        </span>
                        <span className='text-muted small pt-2 ps-1'>
                            {card.percentage>0?'increase':'decrease'}
                        </span>
                    </div>
                </div> */}
                <ForecastedSalesCard card={forecastcard}/>
                <OrdersCard card={ordercard}/>
                <GuestsCard card={guestcard}/>
            </div>
        </div>
    </div>
  );
}

export default Card
