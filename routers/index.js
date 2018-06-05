const Router = require('express').Router()
const user = require('./user')
const email = require('./email')
const interest = require('./interest')

Router.use('/user', user)
Router.use('/email', email)
Router.use('/interest', interest)

module.exports = Router
