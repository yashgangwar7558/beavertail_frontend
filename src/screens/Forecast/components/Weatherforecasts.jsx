import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weatherforecasts.css';
import { FaMapMarkerAlt } from 'react-icons/fa';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('Boston');  
  const [isHourly, setIsHourly] = useState(false);  
  const [isCelsius, setIsCelsius] = useState(true); 
  const [backgroundImage, setBackgroundImage] = useState(''); 
  const API_KEY = 'ccc8b7f30f2b8290435879d3d4264887';
  const MAX_HOURS = 5;
  const MAX_DAYS = 5;

  const fetchWeatherData = () => {
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}`)
      .then(response => {
        setWeatherData(response.data);
      })
      .catch(error => console.error('Error fetching weather data:', error));
  };

  useEffect(() => {
    fetchWeatherData();
    updateBackgroundImage();

    const intervalId = setInterval(() => {
      fetchWeatherData();
      updateBackgroundImage();
    }, 3600000); 

    return () => clearInterval(intervalId);
  }, [location]);

  const updateBackgroundImage = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 12) {
      setBackgroundImage('morning.jpg');
    } else if (currentHour >= 12 && currentHour < 17) {
      setBackgroundImage('afternoon.jpg');
    } else if (currentHour >= 17 && currentHour < 20) {
      setBackgroundImage('evening.jpg');
    } else {
      setBackgroundImage('night.jpg');
    }
  };

  const getStartingIndex = () => {
    const currentTime = new Date();
    if (weatherData) {
      for (let i = 0; i < weatherData.list.length; i++) {
        const forecastTime = new Date(weatherData.list[i].dt_txt);
        if (forecastTime > currentTime) {
          return i;
        }
      }
    }
    return 0;
  };

  const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const convertToFahrenheit = (celsius) => {
    return Math.round((celsius * 9/5) + 32);
  };

  const getHourlyData = () => {
    if (weatherData) {
      const currentTime = new Date();
      const startIndex = getStartingIndex();
      const futureHourlyData = weatherData.list.slice(startIndex).filter((item) => {
        const forecastTime = new Date(item.dt_txt);
        return forecastTime > currentTime;
      });
      return futureHourlyData.slice(0, MAX_HOURS);
    }
    return [];
  };

  const getDailyData = () => {
    if (weatherData) {
      const currentTime = new Date();
      const startIndex = getStartingIndex();
      const uniqueDays = [];
      const dailyData = [];
      for (let i = startIndex; i < weatherData.list.length; i += 8) {
        const item = weatherData.list[i];
        const date = new Date(item.dt_txt).toLocaleDateString();
        const forecastTime = new Date(item.dt_txt);

        if (forecastTime > currentTime && !uniqueDays.includes(date)) {
          uniqueDays.push(date);
          dailyData.push(item);
        }

        if (uniqueDays.length >= MAX_DAYS) {
          break;
        }
      }
      return dailyData;
    }
    return [];
  };

  const hourlyData = isHourly ? getHourlyData() : [];
  const dailyData = !isHourly ? getDailyData() : [];

  if (!weatherData) return <div>Loading...</div>;

  return (
    <div className="weather-container" style={{ backgroundImage: `url(/${backgroundImage})` }}>
      <h1>
        <FaMapMarkerAlt className="location-icon" /> {location}
      </h1>
      <div className="toggle-button-container">
        <button 
          onClick={() => setIsCelsius(true)} 
          className={isCelsius ? "active" : ""}
        >
          °C
        </button>
        <button 
          onClick={() => setIsCelsius(false)} 
          className={!isCelsius ? "active" : ""}
        >
          °F
        </button>
      </div>
      <div className="current-weather">
        <img src={getWeatherIcon(weatherData.list[0].weather[0].icon)} alt={weatherData.list[0].weather[0].description} />
        <p className="temperature-C">
          {isCelsius 
            ? `${Math.round(weatherData.list[0].main.temp)}°C` 
            : `${convertToFahrenheit(weatherData.list[0].main.temp)}°F`
          }
        </p>
      </div>
      <div className="button-container">
        <button onClick={() => setIsHourly(false)} className={!isHourly ? "active" : ""}>Daily</button>
        <button onClick={() => setIsHourly(true)} className={isHourly ? "active" : ""}>Hourly</button>
      </div>
      <div className="weather-data">
        {isHourly ? (
          <div className="hourly-weather">
            {hourlyData.map((hour, index) => (
              <div key={index} className="hour">
                <p>{new Date(hour.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</p> {/* Changed hour12 to false for 24-hour format */}
                <img src={getWeatherIcon(hour.weather[0].icon)} alt={hour.weather[0].description} />
                <p>
                  {isCelsius 
                    ? `${Math.round(hour.main.temp)}°C` 
                    : `${convertToFahrenheit(hour.main.temp)}°F`
                  }
                </p>
                <p>Humidity: {hour.main.humidity}%</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="daily-weather">
            {dailyData.map((day, index) => (
              <div key={index} className="day">
                <p>{new Date(day.dt_txt).toLocaleDateString('en-US')}</p>
                <img src={getWeatherIcon(day.weather[0].icon)} alt={day.weather[0].description} />
                <p>
                  {isCelsius 
                    ? `${Math.round(day.main.temp)}°C` 
                    : `${convertToFahrenheit(day.main.temp)}°F`
                  }
                </p>
                <p>Humidity: {day.main.humidity}%</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;


















