// routes/transactions.js
const express = require('express');
const Transaction = require('../models/Transaction');
const router = express.Router();

router.get('/transactions', async (req, res) => {
  const { month, search = '', page = 1, per_page = 10 } = req.query;

  // Create a case-insensitive regex for searching
  const searchRegex = new RegExp(search, 'i'); // 'i' for case-insensitive search
  
  // Ensure month is two digits, e.g., '01' for January
  const monthRegex = new RegExp(`-${month}-`); 

  const filter = {
    $and: [
      { date_of_sale: { $regex: monthRegex } }, // Ensure month is part of the date string
      {
        $or: [
          { product_title: searchRegex },
          { description: searchRegex },
          { price: { $regex: searchRegex } }, // Convert price to string in your DB to allow regex
        ],
      }
    ]
  };

  try {
    // Fetch transactions with pagination
    const transactions = await Transaction.find(filter)
      .skip((page - 1) * per_page)
      .limit(parseInt(per_page));

    // Count total documents that match the filter
    const total = await Transaction.countDocuments(filter);

    // Respond with the found transactions and pagination info
    res.json({ data: transactions, pagination: { page: parseInt(page), per_page: parseInt(per_page), total } });
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
