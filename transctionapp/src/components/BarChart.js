import React, { useState, useEffect, useRef } from 'react'; 
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const BarChart = ({ month }) => {
  const [barChartData, setBarChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null); // Ref for the chart

  useEffect(() => {
    const fetchBarChartData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/bar-chart?month=${month}`);
        setBarChartData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
        setError('Error fetching bar chart data');
        setLoading(false);
      }
    };

    fetchBarChartData();
  }, [month]);

  const data = {
    labels: barChartData.map(item => item.range),
    datasets: [
      {
        label: 'Number of Items',
        data: barChartData.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div>
      <h3>Price Range Distribution for {month}</h3>
      {loading ? (
        <p>Loading chart data...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Bar ref={chartRef} data={data} />
      )}
    </div>
  );
};

export default BarChart;
