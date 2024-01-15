const bcrypt = require('bcrypt')

exports.createHash = async password => await bcrypt.hash(password, bcrypt.genSalt(10))

exports.isValidPassword = () => {}