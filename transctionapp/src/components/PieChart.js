import React, { useEffect, useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

const PieChart = ({ month }) => {
  const [pieChartData, setPieChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null); // Ref for the chart

  useEffect(() => {
    const fetchPieChartData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/pie-chart?month=${month}`);
        setPieChartData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pie chart data:', error);
        setError('Error fetching pie chart data');
        setLoading(false);
      }
    };

    fetchPieChartData();
  }, [month]);

  const data = {
    labels: pieChartData.map(item => item._id),
    datasets: [
      {
        label: 'Number of Items',
        data: pieChartData.map(item => item.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  return (
    <div>
      <h3>Category Distribution for {month}</h3>
      {loading ? (
        <p>Loading chart data...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Pie ref={chartRef} data={data} />
      )}
    </div>
  );
};

export default PieChart;
