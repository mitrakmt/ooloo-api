const schoolController = {}
const schoolModel = require('../models/school')

schoolController.GET_SCHOOLS = (req, res) => {
  schoolModel.GET_SCHOOLS().then(status => {
    res.status(200).send(status)
  })
}

module.exports = schoolController
