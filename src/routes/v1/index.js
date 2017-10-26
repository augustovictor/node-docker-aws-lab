const router = require('express').Router()

const categories = require('./categories')
const books = require('./books')

router.use('/books', books)
router.use('/categories', categories)

module.exports = router
