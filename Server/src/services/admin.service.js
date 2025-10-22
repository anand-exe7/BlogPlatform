const express = require('express');
require('dotenv').config();

const app = express();

// Body parser middleware
app.use(express.json());

// Import error handler middleware
const { errorHandler } = require('./middleware');

// Import routes
const adminRoutes = require('./routes');

// Mount routes
app.use('/api/admin', adminRoutes);

// Apply error handler
app.use(errorHandler);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Admin Dashboard API running on port ${PORT}`);
});

module.exports = app;