const userModel = {}
const User = require('../db').Users
const School = require('../db').Schools
const UsersSchools = require('../db').UsersSchools
const authHelpers = require('../helpers/auth')
const _ = require('lodash')
const { Op } = require('sequelize')
const sendError = require('../helpers/sendError')

userModel.SIGN_UP = (email, password, username, university) => {
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
          university,
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

userModel.LOGIN = (email, password) => {
  return User.findOne({
    where: {
      email,
    },
  }).then(user => {
    if (!user) {
      return null
    }
    return authHelpers.comparePasswords(password, user.password).then(result => {
      if (result) {
        return user
      }

      return null
    })
  })
}

userModel.GET_USER = id => {
  return User.findOne({
    where: {
      id,
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'password'],
    },
  }).then(user => {
    return user
  })
}

userModel.GET_USER_PROFILE = username => {
  return User.findOne({
    where: {
      username,
    },
    attributes: ['name', 'role', 'interests'],
  }).then(user => {
    return user
  })
}

userModel.CHECK_USERNAME_IN_USE = username => {
  return User.findOne({
    where: {
      username,
    },
  }).then(user => {
    if (user) {
      return {
        taken: true,
      }
    }
    return {
      taken: false,
    }
  })
}

userModel.DELETE_USER = id => {
  return User.destroy({
    where: {
      id,
    },
  }).then(user => {
    return {
      deleted: true,
    }
  })
}

userModel.UPDATE_USER = (id, dataToUpdate) => {
  let updatedUser = _.pickBy(dataToUpdate, item => {
    return !_.isUndefined(item)
  })
  return User.findOne({
    where: {
      id,
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'password'],
    },
  }).then(user => {
    return user.update(updatedUser).then(status => {
      return status
    })
  })
}

userModel.ADD_USER_SCHOOL = (userId, schoolName) => {
  return User.findOne({
    where: {
      id: userId,
    },
  }).then(user => {
    return user
      .updateAttributes({
        university: schoolName,
      })
      .then(status => {
        return {
          success: true,
        }
      })
  })
}

userModel.DELETE_USER_SCHOOL = userId => {
  return User.findOne({
    where: {
      id: userId,
    },
  }).then(user => {
    return user
      .updateAttributes({
        university: null,
      })
      .then(status => {
        return {
          success: true,
        }
      })
  })
}

userModel.PASSWORD_RESET = (password, email) => {
  return authHelpers.hashPassword(password).then(hash => {
    return User.update(
      {
        password: hash,
      },
      {
        where: {
          email,
        },
      },
    ).then(user => {
      return true
    })
  })
}

userModel.VERIFY_EMAIL = id => {
  return User.update(
    {
      email_verified: true,
    },
    {
      where: {
        id,
      },
    },
  ).then(user => {
    return true
  })
}

userModel.GET_USER_RANK = async id => {
  try {
    const pointsObj = await User.findOne({ where: { id }, attributes: ['points', 'username', 'university'] })
    const { username, university, points } = pointsObj
    const rank = await User.count({ where: { points: { [Op.gt]: points } } })
    return { rank: rank + 1, username, university, points, id }
  } catch (error) {
    console.error('Error in get user rank model', error)
  }
}

userModel.GET_TOP_USERS = async () => {
  try {
    const topUsers = await User.findAll({
      attributes: ['username', 'points', 'university'],
      limit: 10,
      order: [['points', 'DESC'], ['updatedAt']],
    })
    return topUsers.map(({ dataValues }) => dataValues)
  } catch (error) {
    console.error('Error in get rank model', error)
  }
}

userModel.GET_USER_LEADERBOARD = async id => {
  try {
    const topUsersPromise = userModel.GET_TOP_USERS()
    const userRankPromise = userModel.GET_USER_RANK(id)
    const [topUsers, userRank] = await Promise.all([topUsersPromise, userRankPromise])
    const leaderboard = topUsers.map((user, index) => ({ ...user, rank: index + 1 }))
    if (userRank.rank <= 10) {
      leaderboard[userRank.rank - 1].isYou = true
    } else {
      leaderboard.push({ ...userRank, isYou: true })
    }
    return leaderboard
  } catch (error) {
    console.error('Getting userModel leaderboard errror', error)
  }
}

module.exports = userModel
