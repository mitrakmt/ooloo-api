let subscriptionController = {}
let subscriptionModel = require('../models/subscription')

subscriptionController.SUBSCRIBE = (req, res) => {
    let subscribeToId = req.body.subscribeToId
    let userId = req.user.id

    subscriptionModel.SUBSCRIBE(userId, subscribeToId)
        .then(response => {
            res.status(200).send(response)
        })
}

subscriptionController.GET_SUBSCRIPTIONS = (req, res) => {
    let userId = req.user.id

    subscriptionModel.GET_SUBSCRIPTIONS(userId)
        .then(subscriptions => {
            res.status(200).send({
                subscriptions
            })
        })
}

subscriptionController.DELETE_SUBSCRIPTION = (req, res) => {
    let unsubscribeFromId = req.body.unsubscribeFromId
    let userId = req.user.id

    subscriptionModel.DELETE_SUBSCRIPTION(userId, unsubscribeFromId)
        .then(response => {
            res.status(200).send(response)
        })
}

module.exports = subscriptionController