let schoolModel = {}
let School = require('../db').Schools
schoolModel.GET_SCHOOLS = () => {
  return School.findAll({
    where: {
      isActive: true,
    },
  }).then(schools => {
    return {
      schools,
    }
  })
}

module.exports = schoolModel
