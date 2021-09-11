const { v4:uuidv4 } = require('uuid')
const knex = require('../database/connection')
const User  = require('./User')


class PasswordToken {

  async create(email) {
    var user = await User.findByEmail(email)
    if (user !== undefined){
      var token = uuidv4()
      try{
        await knex.insert({
          user_id: user.id,
          used: 0,
          token: token
        }).table('password_tokens')
        return {status: true, token: token}
      }catch(err){
        return {status: false, err: err}
      }
    } else {
      return {status: false, err: 'O email informado não está cadastrado!'}
    }
  }
}

module.exports = new PasswordToken()