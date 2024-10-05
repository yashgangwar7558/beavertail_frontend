import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import data from '../api/staffjson.json';
import './StaffSchedule.css';

const StaffSchedule = () => {
  const [staffData, setStaffData] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    // fetch('http://localhost:4002/staffs')
    //   .then((response) => response.json())
    //   .then((data) => setStaffData(data))
    //   .catch((error) => console.error('Error fetching data:', error));
    setStaffData(data.staffs);
  }, []);

  // Function to get the next 12 days starting from today
  const getNext12Days = () => {
    const today = new Date();
    const days = [];

    for (let i = 0; i < 12; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      days.push(nextDay);
    }

    return days;
  };

  const next12Days = getNext12Days();

  const shifts = ['Morning', 'Afternoon', 'Evening', 'Night'];

  // Function to get the schedule for a specific day
  const getScheduleForDay = (dayStr, shift) => {
    const matchingShift = staffData.find(
      (staff) => staff.tranDdate.startsWith(dayStr) && staff.shiftCategory === shift
    );
    return matchingShift ? matchingShift.noOfStaff : 0;
  };

  // Function to format the date as mm/dd/yyyy
  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Staff Scheduling</h5>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Morning</th>
              <th>Afternoon</th>
              <th>Evening</th>
              <th>Night</th>
            </tr>
          </thead>
          <tbody>
            {next12Days.map((day, index) => {
              return (
                <tr key={index}>
                  <td style={{ width: '80%' }}>{formatDate(day)}</td>
                  <td>{getScheduleForDay(day.toISOString().split('T')[0], 'Morning')}</td>
                  <td>{getScheduleForDay(day.toISOString().split('T')[0], 'Afternoon')}</td>
                  <td>{getScheduleForDay(day.toISOString().split('T')[0], 'Evening')}</td>
                  <td>{getScheduleForDay(day.toISOString().split('T')[0], 'Night')}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default StaffSchedule;





