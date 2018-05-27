let subscriptionRouter = require('express').Router()
let subscriptionController = require('../controllers/subscription')
const checkJwt = require('../middleware/auth')

subscriptionRouter.route('/')
   /**
   * @api {get} /subscription Get all subscriptions
   * @apiName GetSubscriptions
   * @apiGroup Subscriptions
   * @apiPermission authenticated user
   * 
   * @apiHeader (Authorization) {String} authorization Authorization token.
   *
   * @apiSuccess {Array} subscriptions List of all the user's subscriptions
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "subscriptions": [
   *          {
   *            "name": "Mike Mitrakos",
   *            "username": "mitrakmt",
   *            "id": 1,
   *            "pricePerMonth": 45
   *          }
   *       ]
   *     }
   *
   * @apiError Unauthorized Not an authorized or authenticated user.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 401 Not Found
   *     {
   *       "error": "Unauthorized",
   *       "message": "Error response"
   *     }
   */
  .get(checkJwt, subscriptionController.GET_SUBSCRIPTIONS)
   /**
   * @api {post} /subscription Subscribe to a user
   * @apiName Subscribe
   * @apiGroup Subscriptions
   * @apiPermission authenticated user
   * 
   * @apiHeader (Authorization) {String} authorization Authorization token (normally a JWT included "Bearer" at the beginning, but please exclude that text before the token).
   * 
   * @apiParam {Integer} followUserId Id of user to follow.
   * TODO: add everything that has to do with stripe
   *
   * @apiSuccess {Bool} subscribed Boolean of subscribed status
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "subscribed": true
   *     }
   *
   * 
   * @apiError Unauthorized Not an authorized or authenticated user.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 401 Not Found
   *     {
   *       "error": "Unauthorized",
   *       "message": "Error response"
   *     }
   */
  .post(checkJwt, subscriptionController.SUBSCRIBE)
   /**
   * @api {delete} /subscription Unsubscribe to a user
   * @apiName Unsubscribe
   * @apiGroup Subscriptions
   * @apiPermission authenticated user
   * 
   * @apiHeader (Authorization) {String} authorization Authorization token (normally a JWT included "Bearer" at the beginning, but please exclude that text before the token).
   * 
   * @apiParam {Integer} userToUnsubscribeTo Id of user to unsubscribe to.
   *
   * @apiSuccess {Bool} unsubscribed Boolean of successful unsubscribe
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "unsubscribed": true
   *     }
   *
   * 
   * @apiError Unauthorized Not an authorized or authenticated user.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 401 Not Found
   *     {
   *       "error": "Unauthorized",
   *       "message": "Error response"
   *     }
   */
  .delete(checkJwt, subscriptionController.DELETE_SUBSCRIPTION)

module.exports = subscriptionRouter