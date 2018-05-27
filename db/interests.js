let Sequelize = require('sequelize')

module.exports = (db) => {    
    const Interests = db.define('interests', {
        name: {
            type: Sequelize.STRING
        },
    }, {
        freezeTableName: true
    })

    return Interests
}