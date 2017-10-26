class CategoriesRepository {
    constructor(model) {
        this._model = model
    }

    findAll() {
        return this._model.findAll()
    }
}

module.exports = (model) => new CategoriesRepository(model)