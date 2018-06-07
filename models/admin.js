let adminModel = {}
let Question = require('../db').Questions
let User = require('../db').Users
let authHelpers = require('../helpers/auth')
let Interest = require('../db').Interests
let School = require('../db').Schools
const raygun = require('raygun');
const raygunClient = new raygun.Client().init({ apiKey: process.env.RAYGUN_KEY });
let _ = require('lodash')

// QUESTIONS
adminModel.ADD_QUESTION = (question) => {
    return Question.create(question)
        .then(question => {
            if (!question) {
                raygunClient.send(new Error('AdminAddQuestion'), {error: "Failed to add question"}, 'AdminAddQuestion', {question}, ['Admin']);
                return {
                    error: "Failed to add question"
                }
            }
            return {
                question,
                error: false
            }
        })
}

adminModel.GET_ALL_QUESTIONS = () => {
    return Question.findAll({
        where: {
            isActive: true
        }
    })
        .then(questions => {
            return questions
        })
}

adminModel.GET_ACTIVE_QUESTIONS = () => {
    return Question.findAll({})
        .then(questions => {
            return questions
        })
}

adminModel.DELETE_QUESTION = (id) => {
    return Question.findOne({
        where: {
            id
        }
    })
    .then(question => {
        if (!question) {
            raygunClient.send(new Error('AdminDeleteQuestion'), {error: "Failed to delete question"}, 'AdminDeleteQuestion', {question}, ['Admin']);
            return {
                error: "Failed to delete question"
            }
        }
        let updatedQuestion = question
        updatedQuestion.isActive = false
        return question.update(
            updatedQuestion
        ).then(status => {
            return status
        })
    })
}

// INTERESTS
adminModel.ADD_MASTER_INTEREST = (interest) => {
    return Interest.create({
        name: interest
    })
    .then(interest => {
        if (!interest) {
            raygunClient.send(new Error('AdminAddInterest'), {error: "Failed to add master interest"}, 'AdminAddInterest', {interest}, ['Admin']);
            return {
                error: "Failed to add master interest"
            }
        }
        return {
            interest
        }
    })
}

adminModel.DELETE_MASTER_INTEREST = (interestId) => {
    return Interest.destroy({
        where: {
            id: interestId
        }
    })
    .then(interest => {
        if (!interest) {
            raygunClient.send(new Error('AdminDeleteInterest'), {error: "Failed to delete master interest"}, 'AdminDeleteInterest', {interest}, ['Admin']);
            return {
                error: "Failed to delete master interest",
                deleted: false
            }
        }
        return {
            deleted: true
        }
    })
}

// ADMIN
adminModel.CREATE_ADMIN = (email, password, username) => {
    return User.findOne({
        where: {
            username
        }
    })
    .then(userFound => {
        if (userFound) {
            return {
                error: 'UsernameTaken'
            }
        }
        return User.findOne({
            where: {
                email
            }
        })
        .then(userFound => {
            if (userFound) {
                return {
                    error: 'EmailTaken'
                }
            }
            return authHelpers.hashPassword(password)
                .then(hash => {
                    return User.create({
                        username,
                        email,
                        password: hash,
                        isAdmin: true
                    })
                    .then(user => {
                        return {
                            user,
                            error: false
                        }
                    })
                })
        })
    })
}

// SCHOOLS
adminModel.ADD_SCHOOL = (school) => {
    return School.create(school)
        .then(school => {
            if (!school) {
                raygunClient.send(new Error('AdminAddSchool'), {error: "Failed to add school"}, 'AdminAddSchool', {school}, ['Admin']);
                return {
                    error: true
                }
            }
            return {
                school,
                error: false
            }
        })
}

adminModel.GET_SCHOOLS = () => {
    return School.findAll({})
        .then(schools => {
            return schools
        })
}

adminModel.DELETE_SCHOOL = (id) => {
    return School.findOne({
        where: {
            id
        }
    })
    .then(school => {
        if (!school) {
            raygunClient.send(new Error('AdminDeleteSchool'), {error: "Failed to delete school"}, 'AdminDeleteSchool', {school}, ['Admin']);
            return {
                error: "Failed to delete school"
            }
        }

        let updatedSchool = school
        updatedSchool.isActive = false
        return school.update(
            updatedSchool
        ).then(status => {
            return status
        })
    })
}

module.exports = adminModel
