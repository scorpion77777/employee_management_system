const connection = require("../config/connection.js")
const chalk = require('chalk')

module.exports = {
  run: function (query, selector = null, log = null, table = true) {
    return new Promise ((resolve, reject) => {
      connection.query(query, selector, (err, res) => {
        if (err) {
          console.log(chalk.red(err));
        } else {
          if (res.length && table) console.table(res)
          if (res.length === 0 && table) console.log(chalk.yellow('Couldn\'t find any records!'))
          if (log) console.log(chalk.green(log))
        }
        resolve(res)
      })
    })
  }
}
