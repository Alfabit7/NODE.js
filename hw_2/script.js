const arrPhone = require('./generateArrayRandomPhoneNumber')

function arrGeneratePhone(quantity) {
    return arrPhone.generateArrayRandomPhoneNumber(quantity);
}

module.exports = { arrGeneratePhone }