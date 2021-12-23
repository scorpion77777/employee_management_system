const chalk = require('chalk')

module.exports = {
  message: function (message, color = 'red', callback) {
    console.log(eval('chalk.' + color +'(message)'))
    callback()
  }
}
