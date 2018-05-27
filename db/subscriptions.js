let Sequelize = require('sequelize')

module.exports = (db) => {    
    const Subscriptions = db.define('subscriptions', {

    }, {
        freezeTableName: true
    })

    return Subscriptions
}