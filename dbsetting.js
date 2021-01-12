require('dotenv').config()
const db = require('knex')({
    client: 'pg',
    connection: {
      host : process.env.HOST,
      user : process.env.USER,
      password : process.env.PASSWORD,
      database : process.env.DATABASE
    }
});


module.exports = db