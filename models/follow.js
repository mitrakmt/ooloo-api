let followsModel = {}
const Follows = require('../db').Follows
const Users = require('../db').Users

followsModel.FOLLOW = (followerId, followedId) => {
  return Follows.create({
    followedId,
    followerId
  })
  .then(follow => {
    return {
      followed: true
    }
  })
}

followsModel.GET_FOLLOWS = (followerId) => {
  return Follows.findAll({
    where: {
      followerId
    }
  })
  .then(follows => {
    let promises = follows.map(follow => {
      return new Promise((resolve, reject) => {
        Users.findOne({
          where: {
            id: follow.followedId
          },
          attributes: ['name','id', 'username']
        })
        .then(users => {
          resolve(users)
        })
        .catch(err => {
          reject(err)
        })
      })
    })

    return Promise.all(promises)
      .then(followedUsers => {
        followedUsers = [].concat.apply([], followedUsers)
        return followedUsers
      })
  })
}

followsModel.DELETE_FOLLOW = (followedId, followerId) => {
  return Follows.destroy({
    where: {
      followedId,
      followerId
    }
  })
  .then(response => {
    return {
      unfollowed: true
    }
  })
}

// followsModel.GET_FOLLOWING = (userId) => {
//   return Follows.findAll({
//     where: {
//       followerId: userId
//     }
//   })
// }

// followsModel.GET_FOLLOW_STATUS = (userId, followedUsername) => {
//   return Users.findOne({
//     where: {
//       username: followedUsername
//     }
//   })
//   .then(followed => {
//     if (!followed) {
//       return false
//     }
    
//     return Follows.findAll({
//       where: {
//         userId: followed.id
//       }
//     })
//     .then(follows => {
//       for (var i = 0; i < follows.length; i++) {
//         if (follows[i].followerId == userId) {
//           return true
//         }
//       }

//       return false
//     })

//   })
// }

module.exports = followsModel