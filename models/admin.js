const adminModel = {}
const Question = require('../db').Questions
const User = require('../db').Users
const authHelpers = require('../helpers/auth')
const Interest = require('../db').Interests
const School = require('../db').Schools
const LoadingFact = require('../db').LoadingFacts
const _ = require('lodash')
const sendError = require('../helpers/sendError')

// QUESTIONS
adminModel.ADD_QUESTION = question => {
  return Question.create(question).then(question => {
    if (!question) {
      sendError('AdminAddQuestion', 'Failed to add question', question, 'Admin')
      return {
        error: 'Failed to add question',
      }
    }
    return {
      question,
      error: false,
    }
  })
}

adminModel.GET_ALL_QUESTIONS = () => {
  return Question.findAll({}).then(questions => {
    return questions
  })
}

adminModel.UPDATE_QUESTION = (questionId, question) => {
  return Question.findOne({
    where: {
      id: questionId,
    },
  }).then(dbQuestion => {
    return dbQuestion
      .updateAttributes({
        question,
      })
      .then(status => {
        return status
      })
  })
}

adminModel.GET_ACTIVE_QUESTIONS = () => {
  return Question.findAll({
    where: {
      isActive: true,
    },
  }).then(questions => {
    return questions
  })
}

adminModel.DELETE_QUESTION = id => {
  return Question.findOne({
    where: {
      id,
    },
  }).then(question => {
    if (!question) {
      sendError('AdminDeleteQuestion', 'Failed to delete question', question, 'Admin')
      return {
        error: 'Failed to delete question',
      }
    }
    return question
      .updateAttributes({
        isActive: false,
      })
      .then(status => {
        return status
      })
  })
}

// INTERESTS
adminModel.GET_MASTER_INTERESTS = () => {
  return Interest.findAll({
    where: {
      isActive: true,
    },
  }).then(interests => {
    return interests
  })
}

adminModel.ADD_MASTER_INTEREST = interest => {
  return Interest.create({
    name: interest,
  }).then(interest => {
    if (!interest) {
      sendError('AdminAddInterest', 'Failed to add master question', interest, 'Admin')
      return {
        error: 'Failed to add master interest',
      }
    }
    return {
      interest,
    }
  })
}

adminModel.DELETE_MASTER_INTEREST = id => {
  return Interest.findOne({
    where: {
      id,
    },
  }).then(interest => {
    if (!interest) {
      sendError('AdminDeleteInterest', 'Failed to delete interest', interest, 'Admin')
      return {
        error: 'Failed to delete interest',
      }
    }

    return interest
      .updateAttributes({
        isActive: false,
      })
      .then(status => {
        return status
      })
  })
}

// ADMIN
adminModel.GET_ADMINS = () => {
  return User.findAll({
    where: {
      isAdmin: true,
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'password', 'isAdmin'],
    },
  }).then(admins => {
    return admins
  })
}

adminModel.CREATE_ADMIN = (email, password, username) => {
  return User.findOne({
    where: {
      username,
    },
  }).then(userFound => {
    if (userFound) {
      return {
        error: 'UsernameTaken',
      }
    }
    return User.findOne({
      where: {
        email,
      },
    }).then(userFound => {
      if (userFound) {
        return {
          error: 'EmailTaken',
        }
      }
      return authHelpers.hashPassword(password).then(hash => {
        return User.create({
          username,
          email,
          password: hash,
          isAdmin: true,
        }).then(user => {
          return {
            user,
            error: false,
          }
        })
      })
    })
  })
}

// LOADING FACTS
adminModel.GET_LOADING_FACTS = () => {
  return LoadingFact.findAll({}).then(facts => {
    return facts
  })
}

adminModel.ADD_LOADING_FACT = providedFact => {
  return LoadingFact.create({ fact: providedFact }).then(fact => {
    if (!fact) {
      sendError('AdminAddLoadingFact', 'Failed to add fact', fact, 'Admin')
      return {
        error: true,
      }
    }
    return {
      fact,
      error: false,
    }
  })
}

adminModel.DELETE_LOADING_FACT = id => {
  return LoadingFact.destroy({
    where: {
      id,
    },
  }).then(user => {
    return {
      deleted: true,
    }
  })
}

// SCHOOLS
adminModel.ADD_SCHOOL = school => {
  return School.create(school).then(school => {
    if (!school) {
      sendError('AdminAddSchool', 'Failed to add school', school, 'Admin')
      return {
        error: true,
      }
    }
    return {
      school,
      error: false,
    }
  })
}

adminModel.GET_SCHOOLS = () => {
  return School.findAll({
    where: {
      isActive: true,
    },
  }).then(schools => {
    return schools
  })
}

adminModel.DELETE_SCHOOL = id => {
  return School.findOne({
    where: {
      id,
    },
  }).then(school => {
    if (!school) {
      sendError('AdminDeleteSchool', 'Failed to delete school', school, 'Admin')
      return {
        error: 'Failed to delete school',
      }
    }

    return school
      .updateAttributes({
        isActive: false,
      })
      .then(status => {
        return status
      })
  })
}

module.exports = adminModel
