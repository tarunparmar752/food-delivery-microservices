const prisma = require("../prisma/prismaClient");

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        isDeleted: true,
      },
      include: {
        menu: true,
      },
    });
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      phone,
      email,
      location,
      openingDays,
      openingHour,
      closingHour,
    } = req.body;

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        description,
        address,
        phone,
        email,
        location,
        openingDays,
        openingHour: parseInt(openingHour),
        closingHour: parseInt(closingHour),
      },
    });

    res.status(201).json({
      success: true,
      data: restaurant,
      message: "Restaurant created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Failed to create restaurant",
      message: error.message,
    });
  }
};

module.exports = { getAllRestaurants, createRestaurant };