const db = require('./db.config')
const Sequelize = require('sequelize')

// SET TABLE SCHEMA
const Users = require('./users')(db)
const Interests = require('./interests')(db)
const Questions = require('./questions')(db)
const Schools = require('./schools')(db)
const LoadingFacts = require('./loadingFacts')(db)

// CREATE JOIN TABLES
const UsersInterests = db.define('UsersInterests', {})

/**
 * Interests:Users
 * */

// Interests:Users (n:m)
Interests.belongsToMany(Users, {
  through: UsersInterests,
  foreignKey: 'interestId',
})
Users.belongsToMany(Interests, {
  through: UsersInterests,
  foreignKey: 'userId',
})

// HELPER FUNCTION TO DROP ALL TABLES, LEAVE THIS FOR NOW
// db.sync({ force: true }).then(() => {
//   console.log("Tables have been dropped");
// });

db.sync().then(function() {
  console.log('Tables have been Created')
})

module.exports = {
  db,
  Users,
  Interests,
  UsersInterests,
  Questions,
  Schools,
  LoadingFacts,
}
