const router = require('express').Router()

const models = require('../../models');
const Repository = require('../../repositories/categories')
const Controller = require('../../controller/categories')

const controller = Controller(Repository(models.Category))

router.get('/', controller.findAll.bind(controller))

module.exports = router