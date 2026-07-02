import { Drivers } from "../src";

const myIdPay = new Drivers.IDPayDriver("YOUR_TOKEN");

(async () => {
  const s = await myIdPay.createPayment({
    amount: (10000).toString(),
    callback_url: "http://localhost:3000/callback",
    orderId: "123",
    description: "A Customer paying",
  });
  const x = await myIdPay.verifyPayment({
    amount: (10000).toString(),
    orderId: "123",
    authorityId: s.authorityId,
  });

  console.log(s, x);
})();
