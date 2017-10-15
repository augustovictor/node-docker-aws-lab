const app = require('express')()

const routesV1 = require('./routes/v1')

app.use('/api/v1', routesV1)

module.exports = app
