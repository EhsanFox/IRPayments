import { IDPay } from "../src"

const myIdPay = new IDPay("YOUR_TOKEN");

(async () => {
    const s = await myIdPay.CreatePayment("123", 10000, { name: "a customer",  callback: 'http://localhost:3000/callback', sandbox: true })
    const x = await myIdPay.VerifyPayment(s.id, "123", true)

    console.log(s, x)
})()
