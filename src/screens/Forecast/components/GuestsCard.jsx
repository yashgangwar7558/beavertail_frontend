import React, { useState, useEffect } from 'react';
import CardFilter from './CardFilter';
import './card.css';
import data from '../api/csvjson_with_guests.json'
import 'bootstrap-icons/font/bootstrap-icons.css';

// Helper functions for date calculations
const isToday = (date) => {
    const today = new Date();
    const d = new Date(date);
    return today.toDateString() === d.toDateString();
};

const isWithinNextDays = (date, days) => {
    const today = new Date();
    const d = new Date(date);
    const timeDiff = d - today;
    const dayDiff = timeDiff / (1000 * 3600 * 24);
    return dayDiff >= 0 && dayDiff <= days;
};

const isWithinPreviousDays = (date, days) => {
    const today = new Date();
    const d = new Date(date);
    const timeDiff = today - d;
    const dayDiff = timeDiff / (1000 * 3600 * 24);
    return dayDiff >= 0 && dayDiff <= days;
};

function GuestsCard(props) {
    const [filter, setFilter] = useState('Daily');
    const [guestCount, setGuestCount] = useState(0);
    const [previousGuestCount, setPreviousGuestCount] = useState(0);

    // Fetch the data when the component mounts
    useEffect(() => {
        // fetch('http://localhost:4001/cards1')
        //     .then(response => response.json())
        //     .then(data => {
        //         calculateGuestCount(data);
        //     })
        //     .catch(error => console.error('Error fetching data:', error));
        calculateGuestCount(data.cards1)
    }, [filter]);

    useEffect(()=>{
        if(props?.filter){ setFilter(props?.filter);}
       
    },[props?.filter]);

    // Calculate the guest count based on the selected filter
    const calculateGuestCount = (data) => {
        const today = new Date();
        let count = 0;
        let prevCount = 0;

        if (filter === 'Daily') {
            // Get guest count for the next day
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + 1);
            count = data
                .filter(item => isWithinNextDays(item.tranDdate, 1))
                .reduce((total, item) => total + item.Guests, 0);

            // Get previous day's guest count
            const prevDay = new Date(today);
            prevDay.setDate(today.getDate() - 1);
            prevCount = data
                .filter(item => isWithinPreviousDays(item.tranDdate, 1))
                .reduce((total, item) => total + item.Guests, 0);
        } else if (filter === 'Weekly') {
            // Get guest count for the next 7 days
            count = data
                .filter(item => isWithinNextDays(item.tranDdate, 7))
                .reduce((total, item) => total + item.Guests, 0);

            // Get previous 7 days guest count
            prevCount = data
                .filter(item => isWithinPreviousDays(item.tranDdate, 7))
                .reduce((total, item) => total + item.Guests, 0);
        } else if (filter === 'Monthly') {
            // Get guest count for the next 30 days
            count = data
                .filter(item => isWithinNextDays(item.tranDdate, 30))
                .reduce((total, item) => total + item.Guests, 0);

            // Get previous 30 days guest count
            prevCount = data
                .filter(item => isWithinPreviousDays(item.tranDdate, 30))
                .reduce((total, item) => total + item.Guests, 0);
        }

        setGuestCount(count);
        setPreviousGuestCount(prevCount);
    };

    const handleFilterChange = (filter) => {
        setFilter(filter);
    };

    const percentageChange = previousGuestCount === 0
        ? 0
        : ((guestCount - previousGuestCount) / previousGuestCount) * 100;

    const card = {
        "_id": 3,
        "name": "Guests",
        "icon": "bi bi-people",
        "amount": guestCount, // Use guestCount state
        "percentage": percentageChange,
        "active": false,
        "id": "3a28"
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
                        <div className="card-icon2 rounded-circle d-flex align-items-center justify-content-center ">
                            <i className={card.icon}></i>
                        </div>
                        <div className="ps-3">
                            <h6>
                                {card.amount.toLocaleString('en-US')}
                            </h6>
                            <span className={`${
                                card.percentage > 0 ? 'text-success' : 'text-danger'
                            } small pt-1 fw-bold`}>
                                {Math.abs(card.percentage).toFixed(2)}%
                            </span>
                            <span className='text-muted small pt-2 ps-1'>
                                {/* {card.percentage > 0 ? 'increase' : 'decrease'} compared to previous {filter?.toLowerCase()} */}
                                {card.percentage > 0 ? 'increase' : 'decrease'} compared to previous {filter}

                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GuestsCard;



