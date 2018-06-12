const Router = require("express").Router();
const user = require("./user");
const email = require("./email");
const interest = require("./interest");
const admin = require("./admin");
const image = require("./image");

Router.use("/user", user);
Router.use("/email", email);
Router.use("/interest", interest);
Router.use("/admin", admin);
Router.use("/image", image);

module.exports = Router;
