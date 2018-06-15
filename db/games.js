let Sequelize = require('sequelize')

module.exports = (db) => {    
    const Games = db.define('games', {
        topics: Sequelize.ARRAY(Sequelize.STRING)
    }, {
        freezeTableName: true
    })

    return Games
}
