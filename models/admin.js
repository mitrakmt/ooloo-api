let adminModel = {}
let Question = require('../db').Questions
let User = require('../db').Users
let authHelpers = require('../helpers/auth')
let Interest = require('../db').Interests
let School = require('../db').Schools
let _ = require('lodash')

// QUESTIONS
adminModel.ADD_QUESTION = (question) => {
    return Question.create(question)
        .then(question => {
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
        return {
            deleted: true
        }
    })
}

// ADMIN
adminModel.GET_ADMINS = () => {
    return User.findAll({
        where: {
            isAdmin: true
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'password', 'isAdmin']
        }
    })
        .then(admins => {
            return admins
        })
}

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
