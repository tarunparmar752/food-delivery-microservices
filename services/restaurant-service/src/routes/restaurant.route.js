const express = require("express");
const router = express.Router();
const {
  getAllRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurant.controller");

router.get("/", getAllRestaurants);

router.post("/", createRestaurant);

router.patch("/:id", updateRestaurant);

router.delete("/:id", deleteRestaurant);

module.exports = router;
