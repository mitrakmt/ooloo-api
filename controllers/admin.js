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
adminController.GET_MASTER_INTERESTS = (req, res) => {
    adminModel.GET_MASTER_INTERESTS()
        .then(response => {
            res.status(200).send(response)
        })
}

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

// SCHOOLS
adminController.GET_SCHOOLS = (req, res) => {
    adminModel.GET_SCHOOLS()
        .then(response => {
            res.status(200).send(response)
        })
}

adminController.ADD_SCHOOL = (req, res) => {
    let school = {
        name: req.body.name,
        degree: req.body.degree,
        state: req.body.state
    }

    adminModel.ADD_SCHOOL(school)
        .then(response => {
            res.status(200).send(response)
        })
}

adminController.DELETE_SCHOOL = (req, res) => {
    let schoolId = req.body.schoolId

    adminModel.DELETE_SCHOOL(schoolId)
        .then(response => {
            res.status(200).send(response)
        })
}

module.exports = adminController
