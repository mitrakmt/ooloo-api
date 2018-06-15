const interestRouter = require('express').Router()
const interestController = require('../controllers/interest')
const checkJwt = require('../middleware/auth')

interestRouter
  .route('/')
  /**
   * @api {get} /interest Get interests
   * @apiName GetInterests
   * @apiGroup Interests
   * @apiPermission authenticated user
   *
   * @apiHeader (Authorization) {String} authorization Authorization token.
   *
   * @apiSuccess {Array} interests List of all the user's interests
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "interests": []
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
  .get(checkJwt, interestController.GET_INTERESTS)
  /**
   * @api {post} /interest Add an interest to a user's interests list
   * @apiName AddInterest
   * @apiGroup Interests
   * @apiPermission authenticated user
   *
   * @apiHeader (Authorization) {String} authorization Authorization token (normally a JWT included "Bearer" at the beginning, but please exclude that text before the token).
   *
   * @apiParam {Array} interests Array of interests to add.
   *
   * @apiSuccess {Bool} added Boolean of successful addition
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "success": true
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
  .post(checkJwt, interestController.ADD_INTEREST)
  /**
   * @api {delete} /interest Remove an interest from a user's interests list
   * @apiName DeleteInterest
   * @apiGroup Interests
   * @apiPermission authenticated user
   *
   * @apiHeader (Authorization) {String} authorization Authorization token (normally a JWT included "Bearer" at the beginning, but please exclude that text before the token).
   *
   * @apiParam {String} interest Interest to remove.
   *
   * @apiSuccess {Bool} deleted Boolean of successful deletion
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "deleted": true
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
  .delete(checkJwt, interestController.DELETE_INTEREST)

interestRouter
  .route('/list')
  /**
   * @api {get} /interest/list Get all avaiable interests
   * @apiName GetAvailableInterests
   * @apiGroup Interests
   *
   * @apiHeader (Authorization) {String} authorization Authorization token.
   *
   * @apiSuccess {Array} interests List of all available interests
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "subscriptions": [
   *          {
   *            "interests": []
   *          }
   *       ]
   *     }
   */
  .get(interestController.GET_AVAILABLE_INTERESTS)

module.exports = interestRouter
