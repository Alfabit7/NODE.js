function generateRandomNumber() {
    return (Math.floor(Math.random() * 10)).toString();
}
module.exports = { generateRandomNumber };