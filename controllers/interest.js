
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
    let interests = req.body.interests
    let interestPromises = []

    for(let i = 0; i < interests.length; i++) {
        interestPromises.push(new Promise((resolve, reject) => {
            interestModel.ADD_INTEREST(userId, interests[i])
                .then(response => {
                    resolve(response)
                })
        }))
    }

    Promise.all(interestPromises).then(promiseResponse => {
        res.status(200).send({
            success: true
        })
    });

    interestModel.ADD_INTEREST(userId, interests)
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

interestController.ADD_MASTER_INTEREST = (req, res) => {
    let interest = req.body.interest
    let userRole = req.user.role

    if (userRole === 'User') {
        res.status(401).send({
            error: 'Unauthorized'
        })
        return;
    }

    interestModel.ADD_MASTER_INTEREST(interest)
        .then(response => {
            res.status(200).send(response)
        })
}

interestController.DELETE_MASTER_INTEREST = (req, res) => {
    let interest = req.body.interest
    let userRole = req.user.role

    if (userRole === 'User') {
        res.status(401).send({
            error: 'Unauthorized'
        })
        return;
    }

    interestModel.DELETE_MASTER_INTEREST(interest)
        .then(response => {
            res.status(200).send(response)
        })
}

module.exports = interestController
