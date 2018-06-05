let Sequelize = require('sequelize')

module.exports = (db) => {    
    const Questions = db.define('questions', {
        question: {
            type: Sequelize.STRING,
            required: true
        },
        answers: {
            type: Sequelize.JSON,
            required: true
        },
        correctAnswer: {
            type: Sequelize.STRING,
            required: true
        },
        difficulty: {
            type: Sequelize.INTEGER,
            required: true
        },
        topics: {
            type: Sequelize.JSON,
            required: true
        },
        image: {
            type: Sequelize.STRING
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            default: true
        }
    }, {
        freezeTableName: true
    })

    return Questions
}