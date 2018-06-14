let subscriptionRouter = require('express').Router()
let subscriptionController = require('../controllers/subscription')
const checkJwt = require('../middleware/auth')
const checkAdmin = require('../middleware/admin')

subscriptionRouter
  .route('/')
  .get(checkJwt, subscriptionController.GET_SUBSCRIPTION_PLANS)
  .post(checkJwt, subscriptionController.CREATE_USER_SUBSCRIPTION)
  .delete(checkJwt, subscriptionController.CANCEL_SUBSCRIPTION)

subscriptionRouter
  .route('/customer')
  .post(checkJwt, subscriptionController.CREATE_CUSTOMER)
  .delete(checkJwt, subscriptionController.DELETE_CUSTOMER)

subscriptionRouter
  .route('/plan')
  .post(checkAdmin, subscriptionController.CREATE_NEW_PLAN)
  .delete(checkAdmin, subscriptionController.DELETE_PLAN)

subscriptionRouter
  .route('/product')
  .post(checkAdmin, subscriptionController.CREATE_NEW_PRODUCT)
  .delete(checkAdmin, subscriptionController.DELETE_PRODUCT)

module.exports = subscriptionRouter
