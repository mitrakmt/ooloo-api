const userRouter = require('express').Router()
const userController = require('../controllers/user')
const checkJwt = require('../middleware/auth')

/**
 * /User: Routes to access user functionality
 */

userRouter
  .route('/')
  /**
   * @api {get} /user Get current user object
   * @apiName GetUser
   * @apiGroup User
   * @apiPermission authenticated user
   *
   * @apiHeader (Authorization) {String} authorization Authorization token (normally a JWT included "Bearer" at the beginning, but please exclude that text before the token).
   *
   * @apiSuccess {String} name Name of the User.
   * @apiSuccess {String} email Email of the User.
   * @apiSuccess {String} username Username of the User.
   * @apiSuccess {Bool} email_verified Bool if email_verified of the User.
   * @apiSuccess {String} role Role of the User.
   * @apiSuccess {Array} interests Selected interests of the User.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "name": "John Doe",
   *       "email": "nick.mitrakos@gmail.com",
   *       "username": "nmitrakos",
   *       "email_verified": false,
   *       "role": "Player"
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
  .get(checkJwt, userController.GET_USER)
  /**
   * @api {post} /user Signup new user
   * @apiName SignupUser
   * @apiGroup User
   *
   * @apiParam {String} email Email of user.
   * @apiParam {String} password Password of user. Must be 7 characters in length or greater.
   * @apiParam {String} username Username of user.
   *
   * @apiSuccess {String} jwt JWT for the user.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "Authorization": "someCrazyLongAuthorizationToken"
   *     }
   *
   * @apiError PasswordTooShort The password provided does not meet length requirements of > 6 characters
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 400 Invalid request
   *     {
   *       "error": "PasswordTooShort"
   *     }
   *
   * @apiError emailTaken The email provided is already in use
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 400 Invalid request
   *     {
   *       "error": "EmailTaken"
   *     }
   *
   * @apiError UsernameTaken The username provided is already taken
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 400 Invalid request
   *     {
   *       "error": "UsernameTaken"
   *     }
   *
   *
   * @apiError EmailTaken That email is already in use.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 401 Not Found
   *     {
   *       "error": "EmailTaken"
   *     }
   */
  .post(userController.SIGN_UP)
  /**
   * @api {put} /user Update current user
   * @apiName UpdateUser
   * @apiGroup User
   * @apiPermission authenticated user
   *
   * @apiParam {String} name Name of the User.
   * @apiParam {String} email Email of the User.
   * @apiParam {Array} interests Selected interests of the User.
   *
   * @apiHeader (Authorization) {String} authorization Authorization token (normally a JWT included "Bearer" at the beginning, but please exclude that text before the token).
   *
   * @apiSuccess {String} name Name of the User.
   * @apiSuccess {String} email Email of the User.
   * @apiSuccess {String} username Username of the User.
   * @apiSuccess {Bool} email_verified Bool if email_verified of the User.
   * @apiSuccess {String} role Role of the User.
   * @apiSuccess {Array} interests Selected interests of the User.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "name": "John Doe",
   *       "email": "nick.mitrakos@gmail.com",
   *       "username": "nmitrakos",
   *       "email_verified": false,
   *       "role": "User",
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
  .put(checkJwt, userController.UPDATE_USER)
  /**
   * @api {delete} /user Delete user
   * @apiName DeleteUser
   * @apiGroup User
   * @apiPermission authenticated user
   *
   * @apiHeader (Authorization) {String} authorization Authorization token (normally a JWT included "Bearer" at the beginning, but please exclude that text before the token).
   *
   * @apiSuccess {Bool} deleted Bool if deleted.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "deleted": true
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
  .delete(checkJwt, userController.DELETE_USER)

userRouter
  .route('/login')
  /**
   * @api {post} /user/login Login user
   * @apiName Login
   * @apiGroup User
   *
   * @apiParam {String} email Email of user.
   * @apiParam {String} password Password of user.
   *
   * @apiSuccess {String} jwt JWT of user.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "Authorization": "someCrazyLongAuthorizationToken"
   *     }
   *
   * @apiError AuthError Incorrect email or password.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "error": "IncorrectCredentials"
   *     }
   *
   * @apiError UserNotFound User wasn't found in the database.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "error": "UseNotFound"
   *     }
   */
  .post(userController.LOGIN)

userRouter
  .route('/passwordreset')
  /**
   * @api {post} /user/passwordreset Reset password for user
   * @apiName ResetPasswordFinal
   * @apiGroup User
   *
   * @apiParam {String} token Token pulled from URL
   * @apiParam {String} password Password to use
   *
   * @apiSuccess {Bool} passwordUpdated Boolean if password updated successfully.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "passwordUpdated": true
   *     }
   */
  .post(userController.PASSWORD_RESET)

userRouter
  .route('/logout')
  /**
   * @api {delete} /user/logout Logout user
   * @apiName Logout
   * @apiGroup User
   * @apiPermission authenticated user
   *
   * @apiHeader (Authorization) {String} authorization Authorization token (normally a JWT included "Bearer" at the beginning, but please exclude that text before the token).
   *
   * @apiSuccess {Bool} loggedOut Boolean if logged out successfully.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "loggedOut": true
   *     }
   */
  .delete(checkJwt, userController.LOGOUT)

userRouter
  .route('/username/:username')
  /**
   * @api {get} /user/username/:username Check if username is already taken
   * @apiName CheckIfUsernameInUse
   * @apiGroup User
   *
   * @apiParam {String} username Username to check
   *
   * @apiSuccess {Bool} taken Boolean whether username is taken.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "taken": true
   *     }
   */
  .get(userController.CHECK_USERNAME_IN_USE)

userRouter
  .route('/verifyemail')
  /**
   * @api {post} /user/verifyemail Verify email address
   * @apiName VerifyEmail
   * @apiGroup User
   *
   * @apiParam {String} token Token pulled from URL
   *
   * @apiSuccess {Bool} emailVerified Boolean if verified successfully.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "emailVerified": true
   *     }
   */
  .post(userController.VERIFY_EMAIL)

userRouter.route('/rank/:username').get(userController.GET_USER_RANK)

userRouter
  .route('/school')
  .post(checkJwt, userController.ADD_USER_SCHOOL)
  .delete(checkJwt, userController.REMOVE_USER_SCHOOL)

userRouter.route('/leaderboard').get(userController.GET_TOP_USERS)

userRouter.route('/leaderboard/:id').get(userController.GET_USER_LEADERBOARD)

userRouter
  .route('/:username')
  /**
   * @api {get} /user Get user profile
   * @apiName GetUserProfile
   * @apiGroup User
   * @apiPermission authenticated user
   *
   * @apiParam {String} username A user's username
   *
   * @apiHeader (Authorization) {String} authorization Authorization token (normally a JWT included "Bearer" at the beginning, but please exclude that text before the token).
   *
   * @apiSuccess {String} name Name of the User.
   * @apiSuccess {String} username Username of the User.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "Name": "John Doe",
   *       "Username": "jdoe"
   *     }
   *
   * @apiError UserNotFound The username of the User was not found.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "error": "UserNotFound"
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
  .get(checkJwt, userController.GET_USER_PROFILE)

module.exports = userRouter
