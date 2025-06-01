const GenericRepository = require("../shared-db/generic.repository");
const prisma = require("../shared-db/prismaClient");
const { restaurant } = require("@prisma/client");

class RestaurantRepository extends GenericRepository {
  constructor() {
    super(prisma.restaurant);
  }
}

module.exports = RestaurantRepository;
