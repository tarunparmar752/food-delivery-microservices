const RestaurantRepository = require("../repositories/restaurant.repository.js");

class RestaurantService {
  constructor(RestaurantRepository) {
    this.restaurantRepository = RestaurantRepository;
  }

  async getAllRestaurants() {
    return await this.restaurantRepository.findAll();
  }

  async getRestaurantById(id) {
    return await this.restaurantRepository.findById(id);
  }

  async createRestaurant(restaurantData) {
    return await this.restaurantRepository.create(restaurantData);
  }

  async updateRestaurant(id, restaurantData) {
    return await this.restaurantRepository.update(id, restaurantData);
  }

  async deleteRestaurant(id) {
    return await this.restaurantRepository.softDelete(id);
  }
}

module.exports = RestaurantService;
