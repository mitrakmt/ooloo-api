let Follows = require('../models/follow')
let Users = require('../db').Users
let followsController = {}

followsController.FOLLOW = (req, res) => {
  let followerId = req.user.id
  let followUserId = req.body.followUserId

  Follows.FOLLOW(followerId, followUserId)
    .then(status => {
      res.status(200).send(status)
    })
}

followsController.GET_FOLLOWS = (req, res) => {
  let followerId = req.user.id

  Follows.GET_FOLLOWS(followerId)
  .then(follows => {
    res.status(200).send({
      follows
    })
  })
}

followsController.DELETE_FOLLOW = (req, res) => {
  let followerId = req.user.id
  let followedId = req.body.userToUnfollow

  Follows.DELETE_FOLLOW(followedId, followerId)
    .then(response => {
      res.status(200).send(response)
    })
}

// followsController.GET_FOLLOWING = (req, res) => {
//   let userId = req.params.userId

//   Follows.GET_FOLLOWING(userId)
//     .then(follows => {
//       let promises = follows.map(follow => {
//         return new Promise((resolve, reject) => {
//           Users.findAll({
//             where: {
//               id: follow.userId
//             }
//           })
//           .then(users => {
//             resolve(users)
//           })
//           .catch(err => {
//             reject(err)
//           })
//         })
//       })

//       Promise.all(promises)
//         .then(followedUsers => {
//           followedUsers = [].concat.apply([], followedUsers)
//           res.status(200).send(followedUsers)
//         })
//         .catch(err => {
//           res.status(204).send({err: err})
//         })
//     })
// }

// followsController.GET_FOLLOW_STATUS = (req, res) => {
//   let userId = req.params.userId
//   let followedUsername = req.headers['followedusername']

//   Follows.GET_FOLLOW_STATUS(userId, followedUsername)
//     .then(status => {
//       res.status(200).send(status)
//     })
// }

module.exports = followsController