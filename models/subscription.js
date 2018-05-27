let subscriptionsModel = {}
const Subscriptions = require('../db').Subscriptions
const Users = require('../db').Users

subscriptionsModel.SUBSCRIBE = (userId, subscribedToId) => {
    // TODO: get info from influencer, cost
    // TODO: set up subscription and charge card

    return Subscriptions.create({
        subscribedFromId: userId,
        subscribedToId
    })
    .then(response => {
        return {
            subscribed: true
        }
    })
}

subscriptionsModel.GET_SUBSCRIPTIONS = (userId) => {
    return Subscriptions.findAll({
        where: {
          subscribedFromId: userId
        }
      })
      .then(subscriptions => {
        let promises = subscriptions.map(subscription => {
          return new Promise((resolve, reject) => {
            Users.findOne({
              where: {
                id: subscription.subscribedToId
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
          .then(subscribedToUsers => {
            subscribedToUsers = [].concat.apply([], subscribedToUsers)
            return subscribedToUsers
          })
      })
}

subscriptionsModel.DELETE_SUBSCRIPTION = (userId, unsubscribeFromId) => {
    // TODO: remove subscription in stripe

    return Subscriptions.destroy({
        where: {
            subscribedToId: unsubscribeFromId,
            subscribedFromId: userId
        }
    })
    .then(response => {
        return {
            unsubscribed: true
        }
    })
}

module.exports = subscriptionsModel