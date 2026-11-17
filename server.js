// Server.js : This file sets up the Express server, defines routes, and connects to 
// the PostgreSQL database.

const express = require('express');
const pool = require('./db');
const triviaRoutes = require('./routes/triviaRoutes');

const app = express();

// Parse incoming JSON requests
app.use(express.json());

// Routes
app.use('/triviabook', triviaRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to Triviabook API!');
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Test database connections
pool.query('SELECT NOW()')
    .then(result => console.log('Database connected:', result.rows[0]))
    .catch(error => console.error('Database connection error:', error));