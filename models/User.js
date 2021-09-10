const knex = require('../database/connection')
const bcrypt = require('bcrypt')

class User {

  async create(email, password, name) {
    try {
      var hash = await bcrypt.hash(password, 10)

      await knex.insert({ email, password: hash, name, role: 0 }).table('users')

    } catch (err) {
      console.log(err)
    }
  }

  async findEmail(email) {
    try {
      var data = await knex.select('*').from('users').where({ email: email })
      if (data.length > 0) {
        return true
      } else {
        return false
      }
    } catch (err) {
      console.log(err)
      return false
    }
  }

  async findAll() {
    try {
      var data = await knex.select(['id', 'name', 'email', 'role']).table('users')

      if (data.length > 0) {
        return data[0]
      } else {
        return undefined
      }

    } catch (err) {
      console.log(err)
      return []
    }
  }

  async findById(id) {
    try {
      var data = knex.select(['id', 'name', 'email', 'role']).table('users').where({ id: id })
      return data
    } catch (err) {
      console.log(err)
      return undefined
    }
  }

}

module.exports = new User()