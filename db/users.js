let Sequelize = require('sequelize')

module.exports = (db) => {    
    const Users = db.define('users', {
        name: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            required: true
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            required: true
        },
        university: {
            type: Sequelize.INTEGER,
            required: true
        },
        password: {
            type: Sequelize.STRING,
            required: true
        },
        email_verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        isAdmin: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        rank: {
            type: Sequelize.STRING,
            defaultValue: 0
        },
        points: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        gender: {
            type: Sequelize.STRING
        },
        image: {
            type: Sequelize.STRING,
        }
    }, {
        freezeTableName: true
    })

    return Users
}
