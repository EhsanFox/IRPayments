export type ZPStatusCodes =
  | "-1"
  | -1
  | "-2"
  | -2
  | "-3"
  | -3
  | "-4"
  | -4
  | "-9"
  | -9
  | "-10"
  | -10
  | "-11"
  | -11
  | "-12"
  | -12
  | "-13"
  | -13
  | "-14"
  | -14
  | "-15"
  | -15
  | "-16"
  | -16
  | "-17"
  | -17
  | "-18"
  | -18
  | "-19"
  | -19
  | "-21"
  | -21
  | "-22"
  | -22
  | "-30"
  | -30
  | "-31"
  | -31
  | "-32"
  | -32
  | "-33"
  | -33
  | "-34"
  | -34
  | "-35"
  | -35
  | "-36"
  | -36
  | "-37"
  | -37
  | "-38"
  | -38
  | "-39"
  | -39
  | "-40"
  | -40
  | "-41"
  | -41
  | "-42"
  | -42
  | "-50"
  | -50
  | "-51"
  | -51
  | "-52"
  | -52
  | "-53"
  | -53
  | "-54"
  | -54
  | "-55"
  | -55
  | "-60"
  | -60
  | "-61"
  | -61
  | "-62"
  | -62
  | "-63"
  | -63
  | "100"
  | 100
  | "101"
  | 101;

export interface ZPVerifyRawResult extends Record<string, unknown> {
  data: {
    code: ZPStatusCodes;
    message: "Verified" | string;
    card_hash: string;
    card_pan: string;
    ref_id: number;
    fee_type: "Merchant" | string;
    fee: number;
  };
  errors: string[];
}

export interface ZPInquiryRawResult extends Record<string, unknown> {
  data: {
    status: "REVERSED" | "FAILED" | "IN_BANK" | "PAID" | "VERIFIED";
    code: ZPStatusCodes;
    message: string;
  };
  errors: string[];
}

export interface _ZPRawCreatePaymentObject {
  merchant_id: string;
  amount: number;
  description: string;
  callback_url: string;

  currency?: "IRT" | "IRR";
  referrer_id?: string;
  metadata?: {
    mobile?: string;
    email?: string;
    order_id?: string;
  };
  mobile?: string;
  email?: string;
  order_id?: string;
}

export interface _ZPCreatePaymentRawResult {
  data: {
    code: ZPStatusCodes;
    message: string;
    authority: string;
    fee_type: string;
    fee: number;
  };
  errors: string[];
}

export interface _ZPVerifyPaymentObject {
  merchant_id: string;
  amount: number;
  authority: string;
}

export interface _ZPInquiryObject {
  merchant_id: string;
  authority: string;
}
