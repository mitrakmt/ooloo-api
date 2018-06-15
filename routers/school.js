let schoolRouter = require('express').Router()
let schoolController = require('../controllers/school')
const checkJwt = require('../middleware/auth')

schoolRouter
  .route('/')
  /**
   * @api {get} /school Get schools
   * @apiName GetSchools
   * @apiGroup Schools
   * @apiPermission authenticated user
   *
   * @apiHeader (Authorization) {String} authorization Authorization token.
   *
   * @apiSuccess {Array} schools List of all schools
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "schools": []
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
  .get(checkJwt, schoolController.GET_SCHOOLS)

module.exports = schoolRouter
