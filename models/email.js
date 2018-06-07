let emailModel = {}
let Users = require('../db').Users
const raygun = require('raygun');
const raygunClient = new raygun.Client().init({ apiKey: process.env.RAYGUN_KEY });

emailModel.PASSWORD_RESET = (email, token) => {
    return Users.update({
        token
      }, {
        where: { 
            email
        }
      })
      .then(result => {
        if (!result) {
          raygunClient.send(new Error('PasswordReset'), {
            error: "Password reset failure"
          }, () => {}, {}, ['Email']);
          return 'Error'
        }
        return `https://www.ooloo.app/passwordreset/${token}`
      });
}


module.exports = emailModel