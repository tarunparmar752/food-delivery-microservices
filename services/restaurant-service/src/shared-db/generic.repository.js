class GenericRepository {
  constructor(model) {
    this.model = model;
  }

  async findMany(query = {}) {
    return this.model.findMany(query);
  }

  async findUnique(query) {
    return this.model.findUnique(query);
  }

  async create(data) {
    return this.model.create({ data });
  }

  async update(where, data) {
    return this.model.update({ where, data });
  }

  async softDelete(where) {
    return this.model.update({ where, data: { isDeleted: true } });
  }
}

module.exports = GenericRepository; 