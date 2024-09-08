import React, { useState, useEffect } from 'react';
import CardFilter from './CardFilter';
import './card.css';
import data from '../api/csvjson_with_guests.json'

function ForecastedSalesCard(props) {
    const [filter, setFilter] = useState('Daily');
    const [salesData, setSalesData] = useState([]);
    const [filteredAmount, setFilteredAmount] = useState(0);
    const [previousAmount, setPreviousAmount] = useState(0);

    useEffect(() => {
        // Fetch data from the API
        // fetch('http://localhost:4001/cards1')
        //     .then(response => response.json())
        //     .then(data => setSalesData(data));
            setSalesData(data.cards1)
    }, []);

    useEffect(()=>{
        if(props?.filter ){ setFilter(props?.filter);}
       
    },[props?.filter]);

    
    useEffect(() => {
        const today = new Date();
        let amount = 0;
        let previousAmount = 0;

        if (filter === 'Daily') {
            // Sales for the next day
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + 1);

            amount = salesData
                .filter(item => {
                    const itemDate = new Date(item.tranDdate);
                    return itemDate.toDateString() === nextDay.toDateString();
                })
                .reduce((acc, item) => acc + item.OrderAmount, 0);

            // Sales for the current day (previous day for comparison)
            const previousDay = new Date(today);
            previousDay.setDate(today.getDate() - 1);

            previousAmount = salesData
                .filter(item => {
                    const itemDate = new Date(item.tranDdate);
                    return itemDate.toDateString() === previousDay.toDateString();
                })
                .reduce((acc, item) => acc + item.OrderAmount, 0);
        } else if (filter === 'Weekly') {
            // Sales for the next 7 days
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() + 1);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 7);

            amount = salesData
                .filter(item => {
                    const itemDate = new Date(item.tranDdate);
                    return itemDate >= startOfWeek && itemDate < endOfWeek;
                })
                .reduce((acc, item) => acc + item.OrderAmount, 0);

            // Sales for the previous 7 days
            const previousStartOfWeek = new Date(today);
            previousStartOfWeek.setDate(today.getDate() - 7);
            const previousEndOfWeek = new Date(today);

            previousAmount = salesData
                .filter(item => {
                    const itemDate = new Date(item.tranDdate);
                    return itemDate >= previousStartOfWeek && itemDate < previousEndOfWeek;
                })
                .reduce((acc, item) => acc + item.OrderAmount, 0);
        } else if (filter === 'Monthly') {
            // Sales for the next 30 days
            const startOfMonth = new Date(today);
            startOfMonth.setDate(today.getDate() + 1);
            const endOfMonth = new Date(startOfMonth);
            endOfMonth.setDate(startOfMonth.getDate() + 30);

            amount = salesData
                .filter(item => {
                    const itemDate = new Date(item.tranDdate);
                    return itemDate >= startOfMonth && itemDate < endOfMonth;
                })
                .reduce((acc, item) => acc + item.OrderAmount, 0);

            // Sales for the previous 30 days
            const previousStartOfMonth = new Date(today);
            previousStartOfMonth.setDate(today.getDate() - 30);
            const previousEndOfMonth = new Date(today);

            previousAmount = salesData
                .filter(item => {
                    const itemDate = new Date(item.tranDdate);
                    return itemDate >= previousStartOfMonth && itemDate < previousEndOfMonth;
                })
                .reduce((acc, item) => acc + item.OrderAmount, 0);
        }

        setFilteredAmount(amount);
        setPreviousAmount(previousAmount);
    }, [filter, salesData]);

    const handleFilterChange = filter => {
        setFilter(filter);
    };

    const percentageChange = ((filteredAmount - previousAmount) / (previousAmount || 1)) * 100;

    const card = {
        "_id": 1,
        "name": "Forecasted Sales",
        "icon": "bi bi-coin",
        "amount": filteredAmount.toFixed(2),
        "percentage": percentageChange.toFixed(2),
        "active": true,
        "id": "5858"
    };

    return (
        <div className="col-xxl-4 col-md-6">
            <div className="card info-card sales-card">
                <CardFilter filterChange={handleFilterChange} />
                <div className="card-body">
                    <h5 className="card-title">
                        {card.name}<span>| {filter}</span>
                    </h5>
                    <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                            <i className={card.icon}></i>
                        </div>
                        <div className="ps-3">
                            <h6>
                                {'$' + card.amount.toLocaleString('en-US')}
                            </h6>
                            <span className={`${
                                card.percentage > 0 ? 'text-success' : 'text-danger'
                            } small pt-1 fw-bold`}>
                                {(Math.abs(card.percentage)).toFixed(2)}%
                            </span>
                            <span className='text-muted small pt-2 ps-1'>
                                {/* {card.percentage > 0 ? 'increase' : 'decrease'} compared to previous {filter? filter?.toLowerCase():""} */}
                                {card.percentage > 0 ? 'increase' : 'decrease'} compared to previous {filter}

                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForecastedSalesCard;






