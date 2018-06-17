const emailController = {}
const Mailchimp = require('mailchimp-api-v3')
const mailchimp = new Mailchimp(process.env.MAILCHIMP_API)
const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_API, domain: process.env.MAILGUN_DOMAIN })
const emailModel = require('../models/email')
const generatePasswordResetToken = require('../helpers/auth').generatePasswordResetToken
const sendError = require('../helpers/sendError')

emailController.CONTACT_US = (req, res) => {
  let message = req.body.message
  let topic = req.body.topic
  let email = req.body.email
  let name = req.body.name

  let emailData = {
    from: email,
    to: 'contact@ooloo.app',
    subject: '[CONTACT] - Topic: ' + topic,
    text: 'Name: ' + name + ', Topic: ' + topic + '\n \n' + message,
  }

  mailgun.messages().send(emailData, (err, body) => {
    if (err) {
      sendError('EmailContactUs', err, req, 'Email')
      res.status(400).send({
        sent: false,
        error: err,
      })
    } else {
      res.status(200).send({
        sent: true,
      })
    }
  })
}

emailController.SIGN_UP = (req, res) => {
  let email = req.body.email
  let firstName = req.body.firstName
  let lastName = req.body.lastName
  // TODO: names not being saved correctly

  mailchimp
    .post('/lists/627367da02/members', {
      email_address: email,
      firstName,
      lastName,
      status: 'subscribed',
    })
    .then(results => {
      res.status(200).send({
        subscribed: true,
      })
    })
}

emailController.PASSWORD_RESET = (req, res) => {
  let email = req.body.email
  let token = generatePasswordResetToken(email)
  let emailData = {
    from: 'passwordreset@ooloo.app',
    to: email,
    subject: 'Ooloo - Password Reset',
    text: `Please use the following link to reset your password: https://www.ooloo.app/passwordreset/${token}
    
    This link will expire in 60 minutes.`,
  }

  mailgun.messages().send(emailData, (err, body) => {
    if (err) {
      sendError('EmailPasswordReset', err, req, 'Email')
      res.status(400).send({
        sent: false,
        error: err,
      })
    } else {
      res.status(200).send({
        sent: true,
      })
    }
  })
}

module.exports = emailController
