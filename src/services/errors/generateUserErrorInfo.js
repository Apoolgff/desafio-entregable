const generateUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid.
        list of require properties:
        *first_name: needs to be a String. recived ${user.first_name}
        *last_name: needs to be a String. recived ${user.last_name}
        *email: needs to be a String. recived ${user.email}
        *age: needs to be a number. recived ${user.age}
    `
}

module.exports = {
    generateUserErrorInfo
}