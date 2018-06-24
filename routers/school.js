const schoolRouter = require('express').Router()
const schoolController = require('../controllers/school')
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

schoolRouter
  .route('/topSchools')
  .get(schoolController.GET_TOP_SCHOOLS)

schoolRouter
  .route('/schoolRank/:id')
  .get(schoolController.GET_SCHOOL_RANK)

schoolRouter
  .route('/leaderboard')
  .get(schoolController.GET_SCHOOL_LEADERBOARD)

module.exports = schoolRouter
