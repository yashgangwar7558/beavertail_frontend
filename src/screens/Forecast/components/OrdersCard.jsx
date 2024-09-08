import React, { useState, useEffect } from 'react'
import CardFilter from './CardFilter'
import './card.css'
import data from '../api/csvjson_with_guests.json'

function OrdersCard(props) {
  const [filter, setFilter] = useState('Daily')
  const [orders, setOrders] = useState([])
  const [currentPeriodOrders, setCurrentPeriodOrders] = useState(0)
  const [previousPeriodOrders, setPreviousPeriodOrders] = useState(0)

  useEffect(() => {
    if (props?.filter) {
      setFilter(props?.filter)
    }
  }, [props?.filter])

  useEffect(() => {
    // Fetch data from the JSON file
    // fetch('http://localhost:4001/cards1')
    //     .then(response => response.json())
    //     .then(data => setOrders(data))
    //     .catch(error => console.error('Error fetching data:', error));

    setOrders(data.cards1)
  }, [])

  useEffect(() => {
    const now = new Date()
    let periodOrders = []
    let prevPeriodOrders = []

    if (filter === 'Daily') {
      const nextDay = new Date(now)
      nextDay.setDate(now.getDate() + 1)
      periodOrders = orders.filter(
        (order) =>
          new Date(order.tranDdate).toDateString() === nextDay.toDateString(),
      ).length

      const previousDay = new Date(now)
      previousDay.setDate(now.getDate() - 1)
      prevPeriodOrders = orders.filter(
        (order) =>
          new Date(order.tranDdate).toDateString() ===
          previousDay.toDateString(),
      ).length
    } else if (filter === 'Weekly') {
      const startOfNextWeek = new Date(now)
      startOfNextWeek.setDate(now.getDate() + (8 - now.getDay())) // Start of the next week
      const endOfNextWeek = new Date(startOfNextWeek)
      endOfNextWeek.setDate(startOfNextWeek.getDate() + 7)
      periodOrders = orders.filter(
        (order) =>
          new Date(order.tranDdate) >= startOfNextWeek &&
          new Date(order.tranDdate) < endOfNextWeek,
      ).length

      const startOfPreviousPeriod = new Date(now)
      startOfPreviousPeriod.setDate(now.getDate() - 7)
      prevPeriodOrders = orders.filter(
        (order) =>
          new Date(order.tranDdate) >= startOfPreviousPeriod &&
          new Date(order.tranDdate) < now,
      ).length
    } else if (filter === 'Monthly') {
      const startOfNextPeriod = new Date(now)
      startOfNextPeriod.setDate(now.getDate() + 1)
      const endOfNextPeriod = new Date(startOfNextPeriod)
      endOfNextPeriod.setDate(startOfNextPeriod.getDate() + 30)
      periodOrders = orders.filter(
        (order) =>
          new Date(order.tranDdate) >= startOfNextPeriod &&
          new Date(order.tranDdate) < endOfNextPeriod,
      ).length

      const startOfPreviousPeriod = new Date(now)
      startOfPreviousPeriod.setDate(now.getDate() - 30)
      prevPeriodOrders = orders.filter(
        (order) =>
          new Date(order.tranDdate) >= startOfPreviousPeriod &&
          new Date(order.tranDdate) < now,
      ).length
    }

    setCurrentPeriodOrders(periodOrders)
    setPreviousPeriodOrders(prevPeriodOrders)
  }, [filter, orders])

  const handleFilterChange = (filter) => {
    setFilter(filter)
  }

  const percentageChange =
    previousPeriodOrders === 0
      ? 0
      : ((currentPeriodOrders - previousPeriodOrders) / previousPeriodOrders) *
        100

  const card = {
    _id: 2,
    name: 'Orders',
    icon: 'bi bi-cart',
    amount: currentPeriodOrders,
    percentage: percentageChange,
    active: false,
    id: '275d',
  }

  return (
    <div className="col-xxl-4 col-md-6">
      <div className="card info-card sales-card">
        <CardFilter filterChange={handleFilterChange} />
        <div className="card-body">
          <h5 className="card-title">
            {card.name}
            <span>| {filter}</span>
          </h5>
          <div className="d-flex align-items-center">
            <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
              <i className={card.icon}></i>
            </div>
            <div className="ps-3">
              <h6>{card.amount.toLocaleString('en-US')}</h6>
              <span
                className={`${
                  card.percentage > 0 ? 'text-success' : 'text-danger'
                } small pt-1 fw-bold`}
              >
                {Math.abs(card.percentage).toFixed(2)}%
              </span>
              <span className="text-muted small pt-2 ps-1">
                {/* {card.percentage > 0 ? 'increase' : 'decrease'} compared to previous {filter?.toLowerCase()} */}
                {card.percentage > 0 ? 'increase' : 'decrease'} compared to
                previous {filter}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrdersCard
