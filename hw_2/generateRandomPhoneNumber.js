const randomNum = require('./generateRandomNumber');
function generateRandomPhoneNumber(quantity) {
    let phoneNumber = '+79';
    for (let i = 0; i < 9; i++) {
        phoneNumber += randomNum.generateRandomNumber();
    }
    return phoneNumber;
}
module.exports = { generateRandomPhoneNumber };