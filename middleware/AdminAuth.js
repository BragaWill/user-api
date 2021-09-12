require('dotenv').config()
const jwt = require('jsonwebtoken')

const SECRET_JWT = process.env.SECRET_JWT

module.exports = function (req, res, next) {
  const authToken = req.headers['authorization']

  if (authToken !== undefined) {
    const bearer = authToken.split(' ')
    var token = bearer[1]
    try {
      var decoded = jwt.verify(token, SECRET_JWT)
      
      if(decoded.role === 1) {
        next()
      }else {
        res.status(403)
        res.send('Usuário não autorizado!')
        return
      }
    } catch (err) {
      res.status(403)
      res.send('Usuário não autenticado!')
      return
    }
  } else {
    res.status(403)
    res.send('Usuário não autenticado!')
    return
  }
}
