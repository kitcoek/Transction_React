import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState({
    totalAmount: 0,
    totalSold: 0,
    totalNotSold: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/statistics?month=${month}`);
        setStatistics(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, [month]);

  return (
    <div className="statistics">
      <h3>Statistics for {month}</h3>
      <div>Total Sale Amount: ${statistics.totalAmount}</div>
      <div>Total Sold Items: {statistics.totalSold}</div>
      <div>Total Not Sold Items: {statistics.totalNotSold}</div>
    </div>
  );
};

export default Statistics;
