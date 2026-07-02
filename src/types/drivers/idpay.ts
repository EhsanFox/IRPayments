export interface IDPayVerifyRawResult extends Record<string, unknown> {
  status:
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "10"
    | "100"
    | "101"
    | "200";
  track_id: string;
  id: string;
  order_id: string;
  amount: string;
  date: string;
  payment: {
    track_id: string;
    amount: string;
    card_no: string;
    hashed_card_no: string;
    date: string;
  };
  verify: {
    date: string;
  };
}

export interface IDPayInquiryRawResult extends Record<string, unknown> {
  status:
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "10"
    | "100"
    | "101"
    | "200";
  track_id: string;
  id: string;
  order_id: string;
  amount: string;
  wage: {
    by: string;
    type: string;
    amount: string;
  };
  date: string;
  payer: {
    name: string;
    phone: string;
    mail: string;
    desc: string;
  };
  payment: {
    track_id: string;
    amount: string;
    card_no: string;
    hashed_card_no: string;
    date: string;
  };
  verify: {
    date: string;
  };
  settlement: {
    track_id: string;
    amount: string;
    date: string;
  };
}

export interface IDPayRawError {
  error_code: number;
  error_message: string;
}

export interface _IDPayRawCreatePaymentObject {
  order_id: string;
  amount: number;
  callback: string;

  name?: string;
  phone?: string;
  mail?: string;
  desc?: string;
}

export interface _IDPayRawCreatePaymentResult {
  id: string;
  link: string;
}

export interface _IDPayRawVerifyPaymentObject {
  id: string;
  order_id: string;
}

export interface _IDPayRawInquiryObject {
  id: string;
  order_id: string;
}
