const User = require('../models/User')

class UserController {

  async index(req, res){}

  async create(req, res) {
    try {
      var {email, password, name} = req.body
      var emailExists = await User.findEmail(email)

      if(emailExists) {
        res.status(406)
        res.send({err: 'O email informado já está cadastrado'})
        return
      }

      if (email === undefined || email === ''){        
        res.status(400)
        res.json({err: 'O email informado é inválido!'})
        return
      }

      if (password === undefined || password === ''){
        res.status(400)
        res.send({err: 'A senha informada é invalida!'})
        return 
      }

      await User.create(email, password, name)

      res.status(200)
      res.send('Ok')
    }catch(err) {
      console.log(err)
    }
  }
}

module.exports = new UserController()