const arrPhone = require('./generateArrayRandomPhoneNumber.js')

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

readline.question(`Ввведите количество телефонов которые вы хотите сгенерировать: `, quantity => {
    console.log(`Обрабатываю запрос на генерацию ${quantity} номеров!`);
    // console.log(arrPhone.generateArrayRandomPhoneNumber(quantity));

    console.log(arrPhone.generateArrayRandomPhoneNumber(quantity));
    readline.close();
});