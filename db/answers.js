let Sequelize = require('sequelize')

module.exports = (db) => {    
    const Answers = db.define('answers', {
        answered:{
            type: Sequelize.ARRAY(Sequelize.STRING),
            required: true
        },
        correct:{
            type: Sequelize.BOOLEAN,
            required: true
        },
        questionId:{
            type: Sequelize.INTEGER,
            required: true
        },
        userId:{
            type: Sequelize.INTEGER
        },
        gameId:{
            type: Sequelize.INTEGER
        },
        timeTaken:{
            type: Sequelize.FLOAT,
            required: true
        }
    }, {
        freezeTableName: true,
    })

    return Answers
}