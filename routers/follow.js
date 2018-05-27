let followsRouter = require('express').Router()
let followsController = require('../controllers/follow')
const checkJwt = require('../middleware/auth')

followsRouter.route('/')
   /**
   * @api {get} /follow Get all follows of logged in user
   * @apiName GetFollows
   * @apiGroup Follows
   * @apiPermission authenticated user
   * 
   * @apiHeader (Authorization) {String} authorization Authorization token.
   *
   * @apiSuccess {Array} follows List of all the users this person is following
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "follows": [
   *          {
   *            "name": "Mike Mitrakos",
   *            "username": "mitrakmt",
   *            "id": 1
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
  .get(checkJwt, followsController.GET_FOLLOWS)
   /**
   * @api {post} /follow Follow a user
   * @apiName Follow
   * @apiGroup Follows
   * @apiPermission authenticated user
   * 
   * @apiHeader (Authorization) {String} authorization Authorization token (normally a JWT included "Bearer" at the beginning, but please exclude that text before the token).
   * 
   * @apiParam {Integer} followUserId Id of user to follow.
   *
   * @apiSuccess {Bool} followed Boolean of follow status
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "followed": true
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
  .post(checkJwt, followsController.FOLLOW)
   /**
   * @api {delete} /follow Unfollow a user
   * @apiName Unfollow
   * @apiGroup Follows
   * @apiPermission authenticated user
   * 
   * @apiHeader (Authorization) {String} authorization Authorization token (normally a JWT included "Bearer" at the beginning, but please exclude that text before the token).
   * 
   * @apiParam {Integer} userToUnfollow Id of user to unfollow.
   *
   * @apiSuccess {Bool} unfollowed Boolean of successful unfollow
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "unfollowed": true
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
  .delete(checkJwt, followsController.DELETE_FOLLOW)

followsRouter.route('/:userId')
  // Gets a user's followers, requires req.params.userId
  // .get(checkJwt, followsController.GET_USER_FOLLOWERS)

// followsRouter.route('/:userId/followStatus')
//   .get(checkJwt, followsController.GET_FOLLOW_STATUS)

module.exports = followsRouter