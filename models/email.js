let emailModel = {}
let Users = require('../db').Users

emailModel.PASSWORD_RESET = (email, token) => {
    return Users.update({
        token
      }, {
        where: { 
            email
        }
      })
      .then(result => {
        return `https://www.ooloo.app/passwordreset/${token}`
      });
}


module.exports = emailModel