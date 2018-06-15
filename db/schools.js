let Sequelize = require('sequelize')

module.exports = db => {
  const Schools = db.define(
    'schools',
    {
      name: {
        type: Sequelize.STRING,
        required: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      state: {
        type: Sequelize.STRING,
        required: true,
      },
      degree: {
        type: Sequelize.STRING,
        required: true,
      },
    },
    {
      freezeTableName: true,
    },
  )

  return Schools
}
