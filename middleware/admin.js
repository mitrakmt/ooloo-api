let jwt = require('jsonwebtoken')

let checkAdmin = (req, res, next) => {
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
        if (user.isAdmin) {
            req.user = user;
            next();
        } else {
            return res.status(401).send({
                error: 'Unauthorized',
                message: 'This user has insufficient authorization'
            }); 
        }
      }
    });
  } else {
    // if there is no token, return error
    return res.status(401).send({
      error: 'Unauthorized',
      message: 'Please sign in to continue'
    });
  }
}

module.exports = checkAdmin