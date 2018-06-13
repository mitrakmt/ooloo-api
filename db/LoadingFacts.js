let Sequelize = require("sequelize");

module.exports = db => {
  const LoadingFacts = db.define(
    "loadingFacts",
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
