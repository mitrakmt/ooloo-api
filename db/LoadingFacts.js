let Sequelize = require('sequelize')

module.exports = db => {
  const LoadingFacts = db.define(
    'loadingFacts',
    {
      fact: {
        type: Sequelize.STRING,
        required: true,
      },
    },
    {
      freezeTableName: true,
    },
  )

  return LoadingFacts
}
