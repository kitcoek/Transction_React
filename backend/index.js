const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/transactionsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected")).catch(err => console.log(err));

// Define Schema for the Transactions
const transactionSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    category: String,
    dateOfSale: String,
    sold: Boolean
});
const Transaction = mongoose.model('Transaction', transactionSchema);

// API to seed the database with data from third-party API
app.get('/api/init', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;
        await Transaction.insertMany(transactions);
        res.status(200).send('Database Initialized');
    } catch (error) {
        res.status(500).send('Error initializing database');
    }
});

// API for transactions
app.get('/api/transactions', async (req, res) => {
    const { page = 1, perPage = 10, title, month } = req.query;

    try {
        const searchFilter = title 
            ? { title: new RegExp(title, 'i') } // Search by title only
            : {};

        const dateFilter = month 
            ? { dateOfSale: new RegExp(month, 'i') } 
            : {};

        const transactions = await Transaction.find({ ...searchFilter, ...dateFilter })
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        // Log fetched transactions for debugging
        console.log('Fetched Transactions:', transactions);

        const count = await Transaction.countDocuments({ ...searchFilter, ...dateFilter });
        
        res.status(200).json({ transactions, total: count });
    } catch (error) {
        console.error('Error fetching transactions:', error); // Log error for debugging
        res.status(500).json({ message: 'Error fetching transactions' });
    }
});





// API for statistics
app.get('/api/statistics', async (req, res) => {
    const { month } = req.query;
    try {
        const dateFilter = { dateOfSale: new RegExp(month, 'i') };
        const totalSold = await Transaction.countDocuments({ ...dateFilter, sold: true });
        const totalNotSold = await Transaction.countDocuments({ ...dateFilter, sold: false });
        const totalAmount = await Transaction.aggregate([
            { $match: { ...dateFilter, sold: true } },
            { $group: { _id: null, totalAmount: { $sum: "$price" } } }
        ]);
        res.json({
            totalAmount: totalAmount[0]?.totalAmount || 0,
            totalSold,
            totalNotSold
        });
    } catch (error) {
        res.status(500).send('Error fetching statistics');
    }
});

// API for bar chart data
app.get('/api/bar-chart', async (req, res) => {
    const { month } = req.query;
    const priceRanges = [
        { label: '0-100', min: 0, max: 100 },
        { label: '101-200', min: 101, max: 200 },
        // Add other ranges...
        { label: '201-300', min: 101, max: 300 },
        { label: '301-400', min: 101, max: 400 },
        { label: '401-500', min: 101, max: 500 },
        { label: '501-600', min: 101, max: 600 },
        { label: '601-700', min: 101, max: 700 },
        { label: '701-800', min: 101, max: 800 },
        { label: '801-900', min: 101, max: 900 },
        { label: '901-above', min: 901, max: Number.MAX_SAFE_INTEGER }
    ];
    try {
        const dateFilter = { dateOfSale: new RegExp(month, 'i') };
        const priceRangeData = await Promise.all(
            priceRanges.map(async (range) => {
                const count = await Transaction.countDocuments({
                    ...dateFilter,
                    price: { $gte: range.min, $lte: range.max }
                });
                return { range: range.label, count };
            })
        );
        res.json(priceRangeData);
    } catch (error) {
        res.status(500).send('Error fetching bar chart data');
    }
});

// API for pie chart data
app.get('/api/pie-chart', async (req, res) => {
    const { month } = req.query;
    try {
        const dateFilter = { dateOfSale: new RegExp(month, 'i') };
        const categoryData = await Transaction.aggregate([
            { $match: dateFilter },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        res.json(categoryData);
    } catch (error) {
        res.status(500).send('Error fetching pie chart data');
    }
});

// API to fetch all combined data
app.get('/api/combined-data', async (req, res) => {
    const { month } = req.query;
    try {
        const transactions = await Transaction.find({ dateOfSale: new RegExp(month, 'i') });
        const stats = await axios.get(`http://localhost:5000/api/statistics?month=${month}`);
        const barChart = await axios.get(`http://localhost:5000/api/bar-chart?month=${month}`);
        const pieChart = await axios.get(`http://localhost:5000/api/pie-chart?month=${month}`);
        res.json({
            transactions,
            stats: stats.data,
            barChart: barChart.data,
            pieChart: pieChart.data
        });
    } catch (error) {
        res.status(500).send('Error fetching combined data');
    }
});

// Server listening on port 5000
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
