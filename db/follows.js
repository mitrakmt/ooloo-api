let Sequelize = require('sequelize')

module.exports = (db) => {    
    const Follows = db.define('follows', {

    }, {
        freezeTableName: true
    })

    return Follows
}