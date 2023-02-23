# 💲 | IRPayments
IR Payments, a package for all payment gateways of IRAN 

Connect your persian Payment Gateways to Your Website/Application with a Class

### ✨| Features
- Conneciton to SandBox
- Supporting Multi API Versions
- Structered Classes
- Supporting Mutli Engines (Web Services) such as IDPay and ZarinPal

## 📂 | Documents
Documents of this Package is live at [/irpayments](https://ehsan.js.org/IRPayments/)

## ✍ | Examples
```javascript
const { IDPay } = require("irpayments/Engines");
const myIDPay = new IDPay("****-****-***");

// Create 100,000 Tomans Donation
myIDPay.CreatePayment("673212", 100000).then(.....);
```
### 📋 | To-Do
- [ ] Structer the Answeres and Behaviors
- [ ] Full documents for Creating & Getting Token
- [ ] Add more Engines

## 📄 | License
[MIT](https://github.com/EhsanFox/irpayments/blob/main/LICENSE)
