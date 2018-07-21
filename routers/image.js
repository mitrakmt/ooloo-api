const imageRouter = require('express').Router()
const imageController = require('../controllers/image')

imageRouter
  .route('/profile/:userId')
  /**
   * @api {post} /image/:userId Upload image
   * @apiName SaveProfileImage
   * @apiGroup Image
   *
   * @apiParam {String} images Your profile image.
   *
   * @apiSuccess {Bool} sent Bool of sent status.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "saved": true
   *     }
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
