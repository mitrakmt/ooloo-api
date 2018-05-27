const Router = require('express').Router()
const user = require('./user')
const email = require('./email')
const follow = require('./follow')
const subscription = require('./subscription')
const interest = require('./interest')

Router.use('/user', user)
Router.use('/email', email)
Router.use('/follow', follow)
Router.use('/subscription', subscription)
Router.use('/interest', interest)

module.exports = Router
