// Генерация случайных телефонов
const arrPhone = require('./generateRandomPhoneNumber.js');

function generateArrayRandomPhoneNumber(quantity) {
    let arrPhoneNumber = [];
    for (let i = 0; i <= quantity; i++) {
        let phoneNum = arrPhone.generateRandomPhoneNumber();
        arrPhoneNumber.push(phoneNum)
    }
    return arrPhoneNumber;
}
module.exports = { generateArrayRandomPhoneNumber };