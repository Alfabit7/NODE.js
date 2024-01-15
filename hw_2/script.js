// Генерация случайных телефонов
let quantity = +prompt('Ввведите количество телефонов которые вы хотите сгенерировать');

console.log(generateArrayRandomPhoneNumber(quantity));

function generateArrayRandomPhoneNumber(quantity) {
    let arrPhoneNumber = [];
    for (let i = 0; i <= quantity; i++) {
        let phoneNum = generateRandomPhoneNumber();
        arrPhoneNumber.push(phoneNum)
    }
    return arrPhoneNumber;
}

function generateRandomPhoneNumber() {
    let phoneNumber = '+79';
    for (let i = 0; i < 9; i++) {
        phoneNumber += generateRandomNumber();
    }
    return phoneNumber;
}

function generateRandomNumber() {
    return (Math.floor(Math.random() * 10)).toString();
}



module.exports = { generateArrayRandomPhoneNumber };