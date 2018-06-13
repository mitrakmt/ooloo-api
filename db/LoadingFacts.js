let Sequelize = require("sequelize");

module.exports = db => {
  const LoadingFacts = db.define(
    "interests",
    {
      fact: {
        type: Sequelize.STRING
      }
    },
    {
      freezeTableName: true
    }
  );

  return LoadingFacts;
};
