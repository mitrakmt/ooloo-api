const interestModel = {}
const User = require('../db').Users
const Interest = require('../db').Interests
const UsersInterests = require('../db').UsersInterests
const _ = require('lodash')
const sendError = require('../helpers/sendError')

interestModel.GET_INTERESTS = userId => {
  return User.findOne({
    where: {
      id: userId,
    },
  }).then(user => {
    return user.getInterests({ attributes: ['name', 'id'] }).then(interests => {
      return interests
    })
  })
}

interestModel.ADD_INTEREST = (userId, interestId) => {
  return Interest.findOne({
    where: {
      id: interestId,
    },
  }).then(interest => {
    if (!interest) {
      sendError('AddInterest', 'Add interest failure - no master interest found for that ID', interestId, 'Interest')
      return {
        success: false,
      }
    }
    return interest.setUsers(userId).then(status => {
      if (!status) {
        sendError('AddInterest', 'Add interest failure - could not setUser interest', interestId, 'Interest')
        return {
          success: false,
        }
      }
      return {
        success: true,
      }
    })
  })
}

interestModel.DELETE_INTEREST = (userId, interestId) => {
  return Interest.findOne({
    where: {
      id: interestId,
    },
  }).then(interest => {
    return interest.removeUser(userId).then(status => {
      if (!status) {
        sendError('DeleteInterest', 'Delete interest failure', interestId, 'Interest')
        return {
          error: 'Delete interest failure',
        }
      }
      return {
        deleted: true,
      }
    })
  })
}

interestModel.GET_AVAILABLE_INTERESTS = () => {
  return Interest.findAll({}).then(interests => {
    return {
      interests,
    }
  })
}

module.exports = interestModel
