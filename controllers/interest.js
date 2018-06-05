
let interestController = {}
let interestModel = require('../models/interest')

interestController.GET_INTERESTS = (req, res) => {
    let userId = req.user.id

    interestModel.GET_INTERESTS(userId)
        .then(status => {
            res.status(200).send(status)
        })
}

interestController.ADD_INTEREST = (req, res) => {
    let userId = req.user.id
    let interestId = req.body.interestId

    interestModel.ADD_INTEREST(userId, interestId)
        .then(response => {
            res.status(200).send(response)
        })
}

interestController.DELETE_INTEREST = (req, res) => {
    let userId = req.user.id
    let interestId = req.body.interestId

    interestModel.DELETE_INTEREST(userId, interestId)
        .then(response => {
            res.send({
                status: 200,
                response
            })
        })
}

interestController.GET_AVAILABLE_INTERESTS = (req, res) => {
    interestModel.GET_AVAILABLE_INTERESTS()
        .then(response => {
            res.status(200).send(response)
        })
}

module.exports = interestController
