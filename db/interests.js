let Sequelize = require('sequelize')

module.exports = (db) => {    
    const Interests = db.define('interests', {
        name: {
            type: Sequelize.STRING
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
    }, {
        freezeTableName: true
    })

    return Interests
}