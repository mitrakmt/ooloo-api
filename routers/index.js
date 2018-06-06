const Router = require('express').Router()
const user = require('./user')
const email = require('./email')
const interest = require('./interest')
const admin = require('./admin')

Router.use('/user', user)
Router.use('/email', email)
Router.use('/interest', interest)
Router.use('/admin', admin)

module.exports = Router
