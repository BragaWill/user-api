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

  async update(id, email, name, role) {
    var user = await this.findById(id)

    if (user !== undefined) {
      var editUser = {}

      if (email != undefined) {
        if (email != user.email) {
          var result = await this.findEmail(email)
          if (result === false) {
            editUser.email = email
          } else {
            return { status: false, err: 'O email já está cadastrado!' }
          }
        }
      }
      if (name != undefined) {
        editUser.name = name
      }
      if (role != undefined) {
        editUser.role = role
      }
      try {
        await knex.update(editUser).where({ id: id }).table('users')
        return { status: true }
      } catch (err) {
        return { status: false, err: err }
      }
    } else {
      return { status: false, err: 'O usuario não existe' }
    }
  }

  async delete(id) {
    var user = await this.findById(id)
    if (user.length === 0) {
      return { status: false, err: 'O usuário não existe.' }
    } else {
      try {
        await knex.delete().where({ id: id }).table('users')
        return { status: true }
      } catch (err) {
        return { status: false, err: err }
      }
    }
  }
}

module.exports = new User()