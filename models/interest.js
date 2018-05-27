let interestModel = {}
let User = require('../db').Users
let Interest = require('../db').Interests
let UsersInterests = require('../db').UsersInterests
let _ = require('lodash')

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
            return interest.setUsers(
                userId
            )
            .then(status => {
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

interestModel.ADD_MASTER_INTEREST = (interest) => {
    return Interest.create({
        name: interest
    })
    .then(interest => {
        return {
            interest
        }
    })
}

interestModel.DELETE_MASTER_INTEREST = (interestId) => {
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

module.exports = interestModel
