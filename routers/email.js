let emailRouter = require('express').Router()
let emailController = require('../controllers/email')

emailRouter.route('/contact')
    /**
     * @api {post} /email/contact Contact GymFlow
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
    .post(emailController.CONTACT_US)

emailRouter.route('/signup')
    /**
     * @api {post} /email/signup Join mailing list
     * @apiName JoinMailingList
     * @apiGroup Email
     *
     * @apiParam {String} email Email of user.
     * @apiParam {String} firstName First name of user.
     * @apiParam {String} lastName Last name of user.
     *
     * @apiSuccess {Bool} subscribed Bool of whether subscribe was successful.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "subscribed": true
     *     }
     */
    .post(emailController.SIGN_UP)

    emailRouter.route('/passwordreset')
    /**
     * @api {post} /email/passwordreset Reset password
     * @apiName PasswordReset
     * @apiGroup Email
     *
     * @apiParam {String} email Email of account to reset password of.
     *
     * @apiSuccess {Bool} subscribed Bool of whether email send was successful.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "sent": true
     *     }
     */
    .post(emailController.PASSWORD_RESET)

module.exports = emailRouter