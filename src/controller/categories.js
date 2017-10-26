class CategoriesController {
    constructor(repository) {
        this._repository = repository
    }

    findAll(req, res) {
        return this._repository.findAll()
            .then(results => res.send(results))
            .catch(e => res.status(500).send(e.message))
    }
}

module.exports = (repository) => new CategoriesController(repository)