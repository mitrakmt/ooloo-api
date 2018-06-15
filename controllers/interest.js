let interestController = {}
let interestModel = require('../models/interest')
let sendError = require('../helpers/sendError')

interestController.GET_INTERESTS = (req, res) => {
  let userId = req.user.id

  interestModel.GET_INTERESTS(userId).then(status => {
    res.status(200).send(status)
  })
}

interestController.ADD_INTEREST = (req, res) => {
  let userId = req.user.id
  let interests = req.body.interests
  let interestPromises = []

  for (let i = 0; i < interests.length; i++) {
    interestPromises.push(
      new Promise((resolve, reject) => {
        interestModel.ADD_INTEREST(userId, interests[i]).then(response => {
          resolve(response)
        })
      }),
    )
  }

  Promise.all(interestPromises).then(promiseResponse => {
    res.status(200).send({
      success: true,
    })
  })
}

interestController.DELETE_INTEREST = (req, res) => {
  let userId = req.user.id
  let interestId = req.body.interestId

  interestModel.DELETE_INTEREST(userId, interestId).then(response => {
    res.send({
      status: 200,
      response,
    })
  })
}

interestController.GET_AVAILABLE_INTERESTS = (req, res) => {
  interestModel.GET_AVAILABLE_INTERESTS().then(response => {
    res.status(200).send(response)
  })
}

module.exports = interestController
