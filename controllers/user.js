let userController = {}
let userModel = require('../models/user')
let authHelpers = require('../helpers/auth')
let Promise = require('bluebird')
let mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_API, domain: process.env.MAILGUN_DOMAIN })
let sendError = require('../helpers/sendError')
let verifyToken = require('../helpers/auth').verifyToken

userController.SIGN_UP = (req, res) => {
  let email = req.body.email
  let password = req.body.password
  let username = req.body.username

  if (password.length < 7) {
    res.status(400).send({
      error: 'PasswordTooShort',
    })
  }

  return userModel.SIGN_UP(email, password, username).then(response => {
    if (response.error) {
      res.status(400).send({
        error: response.error,
      })
    } else {
      let Authorization = authHelpers.generateTokens(response.user.id, response.user.isAdmin)
      let emailData = {
        from: 'contact@ooloo.app',
        to: email,
        subject: 'Ooloo - Email Verification',
        text: `Please use the following link to verify your email: https://www.ooloo.app/emailverification/${Authorization}`,
      }

      mailgun.messages().send(emailData, (err, body) => {
        if (err) {
          sendError('Signup', err, req, 'User')
        }
      })

      res.status(200).send({
        Authorization,
      })
    }
  })
}

userController.PASSWORD_RESET = (req, res) => {
  let password = req.body.password
  let token = req.body.token

  if (password.length < 7) {
    res.status(400).send({
      error: 'PasswordTooShort',
    })
  }

  let verifiedToken = verifyToken(token)
  if (verifiedToken.error) {
    res.status(400).send({
      error: 'InvalidToken',
    })
    return
  }

  return userModel.PASSWORD_RESET(password, verifiedToken.decoded.data).then(response => {
    if (response.error) {
      res.status(400).send({
        error: response.error,
      })
    } else {
      res.status(200).send({
        passwordUpdated: true,
      })
    }
  })
}

userController.VERIFY_EMAIL = (req, res) => {
  let token = req.body.token
  let verifiedToken = verifyToken(token)

  if (verifiedToken.error) {
    res.status(400).send({
      error: 'InvalidToken',
    })
    return
  }

  return userModel.VERIFY_EMAIL(verifiedToken.decoded.id).then(response => {
    if (response.error) {
      res.status(400).send({
        error: response.error,
      })
    } else {
      res.status(200).send({
        emailVerified: true,
      })
    }
  })
}

userController.LOGIN = (req, res) => {
  let email = req.body.email
  let password = req.body.password

  return userModel.LOGIN(email, password).then(user => {
    if (user) {
      if (!user) {
        res.status(400).send({
          error: 'UserNotFound',
        })
        return
      }
      let getTokens = () => {
        return new Promise((resolve, reject) => {
          let tokens = authHelpers.generateTokens(user.id, user.isAdmin)
          resolve(tokens)
        })
      }

      getTokens().then(Authorization => {
        res.status(200).send({
          Authorization,
        })
      })
    } else {
      res.status(400).send({
        error: 'IncorrectCredentials',
      })
    }
  })
}

userController.LOGOUT = (req, res) => {
  res.status(200).send({
    loggedOut: true,
  })
}

userController.GET_USER = (req, res) => {
  let userId = req.user.id

  return userModel.GET_USER(userId).then(user => {
    res.status(200).send(user)
  })
}

userController.CHECK_USERNAME_IN_USE = (req, res) => {
  let username = req.params.username

  return userModel.CHECK_USERNAME_IN_USE(username).then(inUse => {
    res.status(200).send(inUse)
  })
}

userController.GET_USER_PROFILE = (req, res) => {
  let userToFind = req.params.username

  return userModel.GET_USER_PROFILE(userToFind).then(user => {
    res.status(200).send(user)
  })
}

userController.DELETE_USER = (req, res) => {
  let userId = req.user.id

  return userModel.DELETE_USER(userId).then(response => {
    res.status(200).send(response)
  })
}

userController.UPDATE_USER = (req, res) => {
  let userId = req.user.id
  let dataToUpdate = req.body

  return userModel.UPDATE_USER(userId, dataToUpdate).then(user => {
    res.status(200).send(user)
  })
}

module.exports = userController
