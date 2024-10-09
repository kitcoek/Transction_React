import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('March');
  const [page, setPage] = useState(1);

  const fetchTransactions = useCallback(async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/transactions`, {
            params: { search, month, page }
        });
        console.log(response.data); // Log the API response
        setTransactions(response.data.transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
}, [search, month, page]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search by Title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)} // Update search state
      />
      <select value={month} onChange={(e) => setMonth(e.target.value)}>
        <option value="January">January</option>
        <option value="February">February</option>
        <option value="March">March</option>
        <option value="April">April</option>
        <option value="May">May</option>
        <option value="June">June</option>
        <option value="July">July</option>
        <option value="August">August</option>
        <option value="September">September</option>
        <option value="October">October</option>
        <option value="November">November</option>
        <option value="December">December</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Sold</th>
            <th>Date of Sale</th>
          </tr>
        </thead>
        <tbody>
    {transactions.map((transaction) => (
        <tr key={transaction._id}>
            <td>{transaction.title || "No Title"}</td>  // Provide default value
            <td>{transaction.description || "No Description"}</td> // Provide default value
            <td>{transaction.price || "No Price"}</td>  // Provide default value
            <td>{transaction.sold !== undefined ? (transaction.sold ? 'Yes' : 'No') : 'Not Found'}</td> // Check for undefined
            <td>{transaction.dateOfSale || "Invalid Date"}</td>  // Provide default value
                </tr>
            ))}
        </tbody>


      </table>
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
};

export default TransactionTable;
