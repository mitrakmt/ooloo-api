let subscriptionModel = {}
let User = require('../db').Users

subscriptionModel.SAVE_CUSTOMER_ID = (id, customerId) => {
  return User.findOne({
    where: {
      id,
    },
  }).then(user => {
    return user
      .updateAttributes({
        customerId,
      })
      .then(status => {
        return status
      })
  })
}

module.exports = subscriptionModel
