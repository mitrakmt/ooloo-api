const db = require('./db.config')
const Sequelize = require('sequelize')

// SET TABLE SCHEMA
const Users = require('./users')(db)
const Subscriptions = require('./subscriptions')(db)
const Interests = require('./interests')(db)

// CREATE JOIN TABLES
const UsersInterests = db.define('UsersInterests', {})

// ASSIGN RELATIONSHIPS
/* *
* Subscriptions:Users
* */

// Users:Subscriptions (1:n)
// Subscriptions:Users (1:2)
// Users:Users (n:m)


// option { onDelete: 'cascade' } leaves no orphans http://dba.stackexchange.com/questions/44956/good-explanation-of-cascade-on-delete-update-behavior
// option { hooks: true } destroys each instance one by one to safely delete http://docs.sequelizejs.com/en/latest/docs/hooks/
Users.belongsToMany(Users, { as: 'subscribedFrom', through: Subscriptions, foreignKey: 'subscribedFromId', onDelete: 'cascade', hooks: true })
Users.belongsToMany(Users, { as: 'subscribedTo', through: Subscriptions, foreignKey: 'subscribedToId', onDelete: 'cascade', hooks: true })

/* *
* Interests:Users
* */

// Interests:Users (n:m)
Interests.belongsToMany(Users, {through: UsersInterests, foreignKey: 'interestId'})
Users.belongsToMany(Interests, {through: UsersInterests, foreignKey: 'userId'})

// // HELPER TO DROP ALL TABLES
// db.sync({force: true}).then(() => {
//   console.log('Tables have been dropped')
// })

db.sync().then(function () {
  console.log('Tables have been Created')
})

module.exports = {
  db,
  Users,
  Subscriptions,
  Interests,
  UsersInterests
}
