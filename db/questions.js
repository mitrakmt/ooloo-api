let Sequelize = require('sequelize')

module.exports = db => {
  const Questions = db.define(
    'questions',
    {
      question: {
        type: Sequelize.STRING(1000),
        required: true,
      },
      createdBy: {
        type: Sequelize.INTEGER,
        required: true,
      },
      answers: {
        type: Sequelize.JSON,
        required: true,
      },
      correctAnswer: {
        type: Sequelize.JSON,
        required: true,
      },
      difficulty: {
        type: Sequelize.INTEGER,
        required: true,
      },
      topics: {
        type: Sequelize.JSON,
        required: true,
      },
      image: {
        type: Sequelize.STRING,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      freezeTableName: true,
    },
  )

  return Questions
}
