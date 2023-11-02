import axios from "axios";
export * from "./Errors";

export default class ZarinPal {
  private _requestLink = "https://api.zarinpal.com/pg/v4/payment/request.json";
  private _verifyLink = "https://api.zarinpal.com/pg/v4/payment/verify.json";

  private _unVerifiedLink =
    "https://api.zarinpal.com/pg/v4/payment/unVerified.json";
  private _gateway = "https://www.zarinpal.com/pg/StartPay";
  private _currency = "IRR";

  constructor(
    private _merchant: string,
    private _isToman: boolean = false,
    private _isSandbox: boolean = false
  ) {
    if (!_merchant || _merchant.length > 36 || _merchant.length < 36) {
      throw new Error("Zarinpal Pay --> Merchant ID is invalid!");
    }
    if (this._isSandbox) {
      this._requestLink =
        "https://sandbox.zarinpal.com/pg/v4/payment/request.json";
      this._verifyLink =
        "https://sandbox.zarinpal.com/pg/v4/payment/verify.json";
      this._gateway = "https://sandbox.zarinpal.com/pg/StartPay";
    }
    if (_isToman) {
      this._currency = "IRT";
    }
  }

  async create({
    amount,
    description,
    callback_url,
    mobile,
    email,
  }: CreateType) {
    const { data } = await axios.post(this._requestLink, {
      merchant_id: this._merchant,
      amount,
      currency: this._currency,
      description,
      callback_url,
      metadata: [mobile, email],
    });
    if (data.errors?.length) {
      throw new Error(`${JSON.stringify(data.errors)}`);
    }
    return {
      data: {
        ...data.data,
        link: `${this._gateway}/${data.data.authority}`,
      },
      errors: data.errors,
    };
  }
  async verify({ authority, amount }: VerifyType) {
    const { data } = await axios.post(this._verifyLink, {
      merchant_id: this._merchant,
      amount,
      authority,
    });
    if (data.errors?.length) {
      throw new Error(`${JSON.stringify(data.errors)}`);
    }
    return data;
  }
  async unverified() {
    const { data } = await axios.post(this._unVerifiedLink, {
      merchant_id: this._merchant,
    });
    if (data.errors?.length) {
      throw new Error(`Z${JSON.stringify(data.errors)}`);
    }
    return data;
  }
}

interface CreateType {
  amount: number;
  callback_url: string;
  description?: string;
  mobile?: string;
  email?: string;
  order_id?: string;
}
interface VerifyType {
  amount: number;
  authority: string;
}
