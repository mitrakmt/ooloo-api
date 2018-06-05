let adminController = {}
let adminModel = require('../models/admin')
let authHelpers = require('../helpers/auth')
let mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_API, domain: process.env.MAILGUN_DOMAIN });
let verifyToken = require('../helpers/auth').verifyToken

// QUESTIONS
adminController.ADD_QUESTION = (req, res) => {
    const data = {
        question: req.body.question,
        answers: req.body.answers,
        correctAnswer: req.body.correctAnswer,
        topics: req.body.topics,
        difficulty: req.body.difficulty,
        image: req.body.image
    }

    adminModel.ADD_QUESTION(data)
        .then(response => {
            res.status(200).send(response)
        })
}

adminController.GET_ALL_QUESTIONS = (req, res) => {
    adminModel.GET_ALL_QUESTIONS()
        .then(response => {
            res.status(200).send(response)
        })
}

adminController.GET_ACTIVE_QUESTIONS = (req, res) => {
    adminModel.GET_ACTIVE_QUESTIONS()
        .then(response => {
            res.status(200).send(response)
        })
}



adminController.DELETE_QUESTION = (req, res) => {
    const questionId = req.body.questionId

    adminModel.DELETE_QUESTION(questionId)
        .then(response => {
            res.status(200).send(response)
        })
}

// INTERESTS
adminController.ADD_MASTER_INTEREST = (req, res) => {
    let interest = req.body.interest

    adminModel.ADD_MASTER_INTEREST(interest)
        .then(response => {
            res.status(200).send(response)
        })
}

adminController.DELETE_MASTER_INTEREST = (req, res) => {
    let interest = req.body.interest

    adminModel.DELETE_MASTER_INTEREST(interest)
        .then(response => {
            res.status(200).send(response)
        })
}

// ADMIN
adminController.CREATE_ADMIN = (req, res) => {
    const adminPassword = req.body.adminPassword
    if (adminPassword === process.env.ADMIN_PASSWORD) {
        res.status(401).send({
            error: 'Unauthorized'
        })
        return
    }
    let email = req.body.email
    let password = req.body.password
    let username = req.body.username
    
    if (password.length < 7) {
        res.status(400).send({
            error: 'PasswordTooShort'
        })
    }

    return adminModel.CREATE_ADMIN(email, password, username)
        .then(response => {
            if (response.error) {
                res.status(400).send({
                    error: response.error
                })
            } else {
                let Authorization = authHelpers.generateTokens(response.user.id, response.user.isAdmin)
                let emailData = {
                    from: 'contact@ooloo.app',
                    to: email,
                    subject: 'Ooloo - Email Verification',
                    text: `Please use the following link to verify your email: https://www.ooloo.app/emailverification/${Authorization}`
                }
                
                mailgun.messages().send(emailData, (err, body) => {
                    if (err) {
                        console.log('Error in sending verification email to user ' + email)
                    }
                });

                res.status(200).send({
                    Authorization
                })
            }
        })
}

module.exports = adminController
