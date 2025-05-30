const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const restaurantRoute = require("./src/routes/restaurantRoute");

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/v1/restaurants", restaurantRoute);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "Restaurant Service is running!",
    timestamp: new Date().toISOString(),
    service: "restaurant-service",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🍽️  Restaurant Service running on port ${PORT}`);
});
