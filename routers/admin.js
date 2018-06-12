let adminRouter = require("express").Router();
let adminController = require("../controllers/admin");
const checkAdmin = require("../middleware/admin");

adminRouter
  .route("/user")
  .get(checkAdmin, adminController.GET_ADMINS)
  .post(checkAdmin, adminController.CREATE_ADMIN);

adminRouter
  .route("/question")
  /**
   * @api {get} /question Get all active questions
   * @apiName GetActiveQuestions
   * @apiGroup Admin
   * @apiPermission authenticated user (admin)
   *
   * @apiHeader (Authorization) {String} authorization Authorization token.
   *
   * @apiSuccess {Array} questions List of all the active questions
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "questions": []
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
  .get(checkAdmin, adminController.GET_ACTIVE_QUESTIONS)
  /**
   * @api {post} /question Add a question to the master questions list
   * @apiName AddQuestion
   * @apiGroup Admin
   * @apiPermission authenticated user (admin)
   *
   * @apiHeader (Authorization) {String} authorization Authorization token (normally a JWT included "Bearer" at the beginning, but please exclude that text before the token).
   *
   * @apiParam {String} question Question to add.
   * @apiParam {Array} topics Topic IDs of the question.
   * @apiParam {Integer} difficulty Difficulty of the question.
   * @apiParam {Array} answers Answers to add.
   * @apiParam {String} correctAnswer The correct answer from the list.
   * @apiParam {String} image Image to be shown with question.
   *
   * @apiSuccess {Bool} success Boolean of successful addition
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "success": true
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
  .post(checkAdmin, adminController.ADD_QUESTION)
  .put(checkAdmin, adminController.UPDATE_QUESTION)
  /**
   * @api {delete} /question Deactivate a question
   * @apiName DeleteQuestion
   * @apiGroup Admin
   * @apiPermission authenticated user (admin)
   *
   * @apiHeader (Authorization) {String} authorization Authorization token.
   *
   * @apiParam {Integer} questionId Question ID of question to deactivate.
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
  .delete(checkAdmin, adminController.DELETE_QUESTION);

adminRouter
  .route("/question/all")
  /**
   * @api {get} /question/all Get all active and inactive questions
   * @apiName GetAllQuestions
   * @apiGroup Admin
   * @apiPermission authenticated user (admin)
   *
   * @apiHeader (Authorization) {String} authorization Authorization token.
   *
   * @apiSuccess {Array} questions List of all the active and inactive questions
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "questions": []
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
  .get(checkAdmin, adminController.GET_ALL_QUESTIONS);

adminRouter
  .route("/interest")
  .get(checkAdmin, adminController.GET_MASTER_INTERESTS)
  .post(checkAdmin, adminController.ADD_MASTER_INTEREST)
  .delete(checkAdmin, adminController.DELETE_MASTER_INTEREST);

adminRouter
  .route("/school")
  .get(checkAdmin, adminController.GET_SCHOOLS)
  .post(checkAdmin, adminController.ADD_SCHOOL)
  .delete(checkAdmin, adminController.DELETE_SCHOOL);

module.exports = adminRouter;
