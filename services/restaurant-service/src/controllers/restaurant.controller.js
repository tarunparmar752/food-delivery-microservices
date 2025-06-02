const RestaurantRepository = require("../repositories/restaurant.repository.js");
const RestaurantService = require("../services/restaurant.service.js");

const restaurantService = new RestaurantService(new RestaurantRepository());

const getAllRestaurants = async (req, res) => {
  try {
    const {
      search,
      city,
      availabilityStatus,
      isDeleted = false,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const filters = {
      isDeleted: isDeleted === "true" ? true : false,
      ...(availabilityStatus && { isOpen: availabilityStatus === "online" }),
      ...(city && { city }),
    };

    // Pagination
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    const include = {
      menus: {
        where: { is_active: true },
        include: {
          categories: {
            include: {
              items: search
                ? {
                    where: {
                      is_available: true,
                      OR: [
                        { name: { contains: q, mode: "insensitive" } },
                        { description: { contains: q, mode: "insensitive" } },
                      ],
                    },
                  }
                : { where: { is_available: true } },
            },
          },
        },
      },
    };

    if (search) {
      filters.menus = {
        some: {
          is_active: true,
          categories: {
            some: {
              items: {
                some: {
                  is_available: true,
                  OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                  ],
                },
              },
            },
          },
        },
      };
    }

    const totalCount = await prisma.restaurant.count({ where: filters });

    const restaurants = await prisma.restaurant.findMany({
      where: filters,
      include,
      skip,
      take,
      orderBy: { [sortBy]: order },
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      meta: {
        totalCount,
        totalPages,
        currentPage: Number(page),
        hasNextPage: Number(page) < totalPages,
        hasPreviousPage: Number(page) > 1,
      },
      data: restaurants,
    });
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

    const restaurant = await restaurantService.createRestaurant({
      name,
      description,
      address,
      phone,
      email,
      location,
      openingDays,
      openingHour: parseInt(openingHour),
      closingHour: parseInt(closingHour),
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

const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
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
      isOpen,
    } = req.body;

    const restaurant = await restaurantService.updateRestaurant(id, {
      name,
      description,
      address,
      phone,
      email,
      location,
      openingDays,
      openingHour: parseInt(openingHour),
      closingHour: parseInt(closingHour),
      isOpen,
    });

    res.status(200).json({
      success: true,
      data: restaurant,
      message: "Restaurant updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Failed to update restaurant",
      message: error.message,
    });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    await restaurantService.deleteRestaurant(id);
    res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Failed to delete restaurant",
      message: error.message,
    });
  }
};

module.exports = {
  getAllRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
