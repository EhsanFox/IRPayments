const IDPayEngine = require("../src/Engines/IDPay");

const myIDPay = new IDPayEngine("TOKEN HERE")
myIDPay.CreatePayment("123456", 100000)
    .then(console.log)
    .catch(console.error)