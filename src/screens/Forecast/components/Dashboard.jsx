import React, { useState, useEffect } from "react";
import Card from "./Card";
import "./dashboard.css";
import Reports from "./Reports";
import StaffSchedule from "./StaffSchedule";
import CategoryWise from "./CategoryWise";
import ForecastedSalesCard from './ForecastedSalesCard'
import OrdersCard from './OrdersCard';
import GuestsCard from './GuestsCard';
import Category from "./Category";
import Weatherforecasts from "./Weatherforecasts"

function Dashboard(filter) {
  const [cards, setCards] = useState([]);

  const fetchData = () => {
    fetch("http://localhost:4001/cards")
      .then((res) => res.json())
      .then((data) => {
        setCards(data);
      })
      .catch((e) => console.log(e.message));
  };

  useEffect(() => {
    fetchData();
  }, []);

  

  return (
    <section className="dashboard section">
      <div className="row">
        <div className="col-lg-8">
          <div className="row">
            <ForecastedSalesCard filter={filter?.filter} />
            <OrdersCard filter={filter?.filter}/>
            <GuestsCard  filter={filter?.filter}/>
            <div className="col-12">
              <Reports filter={filter?.filter} />
              <Category filter={filter?.filter}/>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          {/* <WeatherForecast filter={filter?.filter} /> */}
          {/* <CategoryWise /> */}
          <Weatherforecasts filter={filter?.filter}/>
          <StaffSchedule/>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
