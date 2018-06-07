let interestModel = {}
let User = require('../db').Users
let Interest = require('../db').Interests
let UsersInterests = require('../db').UsersInterests
let _ = require('lodash')
const raygun = require('raygun');
const raygunClient = new raygun.Client().init({ apiKey: process.env.RAYGUN_KEY });

interestModel.GET_INTERESTS = (userId) => {
    return User.findOne({
        where: {
            id: userId
        }
    })
    .then(user => {
        return user.getInterests({attributes: ['name', 'id']})
            .then(interests => {
                return interests
            })
    })
}

interestModel.ADD_INTEREST = (userId, interestId) => {
        return Interest.findOne({
            where: {
                id: interestId
            }
        })
        .then(interest => {
            if (!interest) {
                raygunClient.send(new Error('AddInterest'), {
                    error: "Add interest failure - no master interest found for that ID"
                }, () => {}, {
                    interestId
                }, ['Interest']);
                return {
                    success: false
                }
            }
            return interest.setUsers(
                userId
            )
            .then(status => {
                if (!status) {
                    raygunClient.send(new Error('AddInterest'), {
                        error: "Add interest failure - couldn't setUser interest"
                    }, () => {}, {
                        interestId
                    }, ['Interest']);
                    return {
                        success: false
                    }
                }
                return {
                    success: true
                }
            })
        })
}

interestModel.DELETE_INTEREST = (userId, interestId) => {
    return Interest.findOne({
        where: {
            id: interestId
        }
    })
    .then(interest => {
        return interest.removeUser(
            userId
        )
        .then(status => {
            if (!status) {
                raygunClient.send(new Error('DeleteInterest'), {
                    error: "Delete interest failure"
                }, () => 'DeleteInterest', {
                    interestId
                }, ['Interest']);
                return {
                    error: "Delete interest failure"
                }
            }
            return {
                deleted: true
            }
        })
    })
}

interestModel.GET_AVAILABLE_INTERESTS = () => {
    return Interest.findAll({})
        .then(interests => {
            return {
                interests
            }
        })
}

module.exports = interestModel
