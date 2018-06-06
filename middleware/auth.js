let jwt = require('jsonwebtoken')

let checkJwt = (req, res, next) => {
  var token = req.headers.authorization;
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(401).send({
            error: 'Unauthorized',
            message: 'Invalid token'
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.user = user;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(401).send({
      error: 'Unauthorized',
      message: 'Please sign in to continue'
    });
  }
}

module.exports = checkJwt