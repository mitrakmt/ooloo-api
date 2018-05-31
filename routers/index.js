const Router = require('express').Router()
const user = require('./user')
const email = require('./email')
const subscription = require('./subscription')
const interest = require('./interest')

Router.use('/user', user)
Router.use('/email', email)
Router.use('/subscription', subscription)
Router.use('/interest', interest)

module.exports = Router
