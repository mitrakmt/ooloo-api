let Sequelize = require('sequelize')

module.exports = db => {
  const News = db.define(
    'news',
    {
      content: {
        type: Sequelize.STRING,
        required: true,
      },
      expiration: {
        type: Sequelize.DATE,
        required: true,
      },
      creator: {
        type: Sequelize.INTEGER,
        required: true,
      },
    },
    {
      freezeTableName: true,
    },
  )

  return News
}
