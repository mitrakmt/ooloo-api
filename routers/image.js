const imageRouter = require('express').Router()
const imageController = require('../controllers/image')

imageRouter
  .route('/profile/:userId')
  /**
   * @api {post} /email/contact Contact Ooloo
   * @apiName ContactUs
   * @apiGroup Email
   *
   * @apiParam {String} email Your email.
   * @apiParam {String} name Your name.
   * @apiParam {String} topic Why are you contacting us.
   * @apiParam {String} message Your message.
   *
   * @apiSuccess {Bool} sent Bool of sent status.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "sent": true
   *     }
   *
   * @apiError FailedToSend There was an issue sending the email
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "error": "someError",
   *       "sent": false
   *     }
   */
  .post(imageController.UPLOAD_PROFILE_IMAGE)
  .get(imageController.GET_PROFILE_IMAGE)

module.exports = imageRouter
