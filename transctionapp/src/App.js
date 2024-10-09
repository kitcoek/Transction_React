import React, { useState } from 'react';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import Statistics from './components/Statistics';
import TransactionTable from './components/TransactionTable';

const App = () => {
  const [month, setMonth] = useState('March');

  return (
    <div className="App">
      <h1>Transaction Dashboard</h1>
      <label>Select Month:</label>
      <select value={month} onChange={(e) => setMonth(e.target.value)}>
        <option value="January">January</option>
        <option value="February">February</option>
        <option value="March">March</option>
        {/* Add other months */}
      </select>

      <Statistics month={month} />
      <BarChart month={month} />
      <PieChart month={month} />
      <TransactionTable month={month} />
    </div>
  );
};

export default App;
