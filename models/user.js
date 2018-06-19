const userModel = {}
const User = require('../db').Users
const authHelpers = require('../helpers/auth')
const _ = require('lodash')
const {Op} = require('sequelize'); 
const sendError = require('../helpers/sendError')

userModel.SIGN_UP = (email, password, username) => {
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

userModel.GET_USER_RANK = async(id)=>{
  try{
    pointsObj = await User.findOne({where:{id}, attributes:['points']});
    const rank = await User.count({where: {points: {[Op.gt]: pointsObj.dataValues.points}}})
    return rank + 1;
  }catch(error){
    console.error('Error in get rank model', error);
  }
}


userModel.GET_TOP_USERS = async()=>{
  try{
    const topUsers = await User.findAll({
      attributes:['username', 'points', 'university'], 
      limit:10,
      order:[['points', 'DESC'],['updatedAt']]
    });
    return topUsers;
  }catch(error){
    console.error('Error in get rank model', error);
  }
}

module.exports = userModel
