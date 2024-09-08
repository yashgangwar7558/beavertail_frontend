import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import data from '../api/staffjson.json'

const StaffSchedule = () => {
  const [staffData, setStaffData] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    // fetch('http://localhost:4002/staffs')
    //   .then((response) => response.json())
    //   .then((data) => setStaffData(data))
    //   .catch((error) => console.error('Error fetching data:', error));
      setStaffData(data.staffs)
  }, []);

  // Function to get the next 7 days starting from today
  const getNext7Days = () => {
    const today = new Date();
    const days = [];

    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      days.push(nextDay);
    }

    return days;
  };

  const next7Days = getNext7Days();

  const shifts = ['Morning', 'Afternoon', 'Evening', 'Night'];

  // Function to get the schedule for a specific day
  const getScheduleForDay = (dayStr, shift) => {
    const matchingShift = staffData.find(
      (staff) => staff.tranDdate.startsWith(dayStr) && staff.shiftCategory === shift
    );
    return matchingShift ? matchingShift.noOfStaff : 0;
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
            {next7Days.map((day, index) => {
              const dayStr = day.toISOString().split('T')[0]; // Format date as yyyy-mm-dd
              return (
                <tr key={index}>
                  <td>{dayStr}</td>
                  <td>{getScheduleForDay(dayStr, 'Morning')}</td>
                  <td>{getScheduleForDay(dayStr, 'Afternoon')}</td>
                  <td>{getScheduleForDay(dayStr, 'Evening')}</td>
                  <td>{getScheduleForDay(dayStr, 'Night')}</td>
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



