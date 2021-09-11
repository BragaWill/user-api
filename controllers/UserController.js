const User = require('../models/User')
const PasswordToken = require('../models/PasswordToken')

class UserController {

  async index(req, res) {
    var users = await User.findAll()
    res.json(users)
  }

  async create(req, res) {
    try {
      var { email, password, name } = req.body

      if (email === undefined || email === '') {
        res.status(400)
        res.json({ err: 'O email informado é inválido!' })
        return
      }

      if (password === undefined || password === '') {
        res.status(400)
        res.send({ err: 'A senha informada é invalida!' })
        return
      }

      var emailExists = await User.findEmail(email)

      if (emailExists) {
        res.status(406)
        res.send({ err: 'O email informado já está cadastrado' })
        return
      }

      await User.create(email, password, name)

      res.status(200)
      res.send('Ok')
    } catch (err) {
      console.log(err)
    }
  }
  async findUser(req, res) {
    var id = req.params.id
    var user = await User.findById(id)
    if (user === undefined) {
      res.status(404)
      res.json({})
    } else {
      res.status(200)
      res.json(user)
    }
  }
  async edit(req, res) {
    var { id, email, name, role } = req.body
    var result = await User.update(id, email, name, role)
    if (result !== undefined) {
      if (result.status) {
        res.status(200)
        res.send('ok')
      } else {
        res.status(406)
        res.send(result.err)
      }
    } else {
      res.status(406)
      res.send('Algo deu errado!')
    }
  }
  async destroy(req, res) {
    var id = req.params.id
    var result = await User.delete(id)
    if (result.status) {
      res.status(200)
      res.send('ok')
    } else {
      res.status(406)
      res.send(result.err)
    }
  }
  async recoverPassword(req, res) {
    var email = req.body.email
    var result = await PasswordToken.create(email)
    if (result.status) {
      // NodeMailer.Send() ==> email p/ usuario recuperar a senha
      res.status(200)
      res.send(result.token)
    } else {
      res.status(406)
      res.send(result.err)
    }
  }
  async changePassword(req, res) {
    var token = req.body.token
    var password = req.body.password

    var isTokenValid = await PasswordToken.validate(token)
    if(isTokenValid.status){
      await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)
      res.status(200)
      res.send('Senha alterada!')
    }else {
      res.status(406)
      res.send('Token inválido!')
    }
  }
}

module.exports = new UserController()