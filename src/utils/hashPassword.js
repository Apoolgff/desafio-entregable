const bcrypt = require('bcrypt')

exports.createHash = async password => await bcrypt.hash(password, bcrypt.genSalt(10))

exports.isValidPassword = async (user, password) => await bcrypt.compare(password, user.password)