const adminController = {}
const adminModel = require('../models/admin')
const authHelpers = require('../helpers/auth')
const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API,
  domain: process.env.MAILGUN_DOMAIN,
})
const verifyToken = require('../helpers/auth').verifyToken
const sendError = require('../helpers/sendError')

// QUESTIONS
adminController.ADD_QUESTION = (req, res) => {
  const data = {
    question: req.body.question,
    answers: req.body.answers,
    correctAnswer: req.body.correctAnswer,
    topics: req.body.topics,
    difficulty: req.body.difficulty,
    image: req.body.image,
  }

  adminModel.ADD_QUESTION(data).then(response => {
    res.status(200).send(response)
  })
}

adminController.GET_ALL_QUESTIONS = (req, res) => {
  adminModel.GET_ALL_QUESTIONS().then(response => {
    res.status(200).send(response)
  })
}

adminController.GET_ACTIVE_QUESTIONS = (req, res) => {
  adminModel.GET_ACTIVE_QUESTIONS().then(response => {
    res.status(200).send(response)
  })
}

adminController.UPDATE_QUESTION = (req, res) => {
  let questionId = req.body.questionId
  let newQuestion = req.body.question

  adminModel.UPDATE_QUESTION(questionId, newQuestion).then(response => {
    res.status(200).send(response)
  })
}

adminController.DELETE_QUESTION = (req, res) => {
  const questionId = req.body.questionId

  adminModel.DELETE_QUESTION(questionId).then(response => {
    res.status(200).send(response)
  })
}

// INTERESTS
adminController.GET_MASTER_INTERESTS = (req, res) => {
  adminModel.GET_MASTER_INTERESTS().then(response => {
    res.status(200).send(response)
  })
}

adminController.ADD_MASTER_INTEREST = (req, res) => {
  let interest = req.body.interest

  adminModel.ADD_MASTER_INTEREST(interest).then(response => {
    res.status(200).send(response)
  })
}

adminController.DELETE_MASTER_INTEREST = (req, res) => {
  let interest = req.body.interest

  adminModel.DELETE_MASTER_INTEREST(interest).then(response => {
    res.status(200).send(response)
  })
}

// ADMIN
adminController.GET_ADMINS = (req, res) => {
  adminModel.GET_ADMINS().then(response => {
    res.status(200).send(response)
  })
}

adminController.CREATE_ADMIN = (req, res) => {
  const adminPassword = req.body.adminPassword
  if (adminPassword === process.env.ADMIN_PASSWORD) {
    res.status(401).send({
      error: 'Unauthorized',
    })
    return
  }
  let email = req.body.email
  let password = req.body.password
  let username = req.body.username

  if (password.length < 7) {
    res.status(400).send({
      error: 'PasswordTooShort',
    })
  }

  return adminModel.CREATE_ADMIN(email, password, username).then(response => {
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
          sendError('AdminCreateAdmin', err, req, 'Admin')
        }
      })

      res.status(200).send({
        Authorization,
      })
    }
  })
}

// LOADING QUESTIONS
adminController.GET_LOADING_FACTS = (req, res) => {
  adminModel.GET_LOADING_FACTS().then(response => {
    res.status(200).send(response)
  })
}

adminController.ADD_LOADING_FACT = (req, res) => {
  let fact = req.body.fact

  adminModel.ADD_LOADING_FACT(fact).then(response => {
    res.status(200).send(response)
  })
}

adminController.DELETE_LOADING_FACT = (req, res) => {
  let factId = req.body.factId

  adminModel.DELETE_LOADING_FACT(factId).then(response => {
    res.status(200).send(response)
  })
}

// SCHOOLS
adminController.GET_SCHOOLS = (req, res) => {
  adminModel.GET_SCHOOLS().then(response => {
    res.status(200).send(response)
  })
}

adminController.ADD_SCHOOL = (req, res) => {
  let school = {
    name: req.body.name,
    degree: req.body.degree,
    state: req.body.state,
  }

  adminModel.ADD_SCHOOL(school).then(response => {
    res.status(200).send(response)
  })
}

adminController.DELETE_SCHOOL = (req, res) => {
  let schoolId = req.body.schoolId

  adminModel.DELETE_SCHOOL(schoolId).then(response => {
    res.status(200).send(response)
  })
}

module.exports = adminController
