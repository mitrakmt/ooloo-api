let subscriptionRouter = require('express').Router()
let subscriptionController = require('../controllers/subscription')
const checkJwt = require('../middleware/auth')
const checkAdmin = require('../middleware/admin')

subscriptionRouter
  .route('/')
  .post(checkJwt, subscriptionController.CREATE_USER_SUBSCRIPTION)
  .delete(checkJwt, subscriptionController.CANCEL_SUBSCRIPTION)

subscriptionRouter.route('/customer').post(checkJwt, subscriptionController.CREATE_CUSTOMER)

subscriptionRouter.route('/plan').post(checkAdmin, subscriptionController.CREATE_NEW_PLAN)

subscriptionRouter.route('/product').post(checkAdmin, subscriptionController.CREATE_NEW_PRODUCT)

module.exports = subscriptionRouter
