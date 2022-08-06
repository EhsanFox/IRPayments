export interface Options {
    sandbox?: boolean;
    phone?: string;
    mail?: string;
    desc?: string;
    callback: string;
    name: string;
}

export interface RequestOptions extends Options {
    order_id: string;
    amount: number;
}

export interface IDPayError {
    error_code?: number;
    error_message?: string;
}

export interface CreatePaymentSucces extends IDPayError {
    id: string
    link: string
}

export interface VerifyPaymentSucces extends IDPayError {
    status: string;
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
    },
    verify: {
       date: string;
    }
}

export interface PaymentStatusSuccess extends IDPayError {
    status : string 
    track_id : string
    id : string
    order_id : string
    amount : string
    wage: {
      by : string
      type : string
      amount : string
    },
    date : string
    payer: {
      name : string
      phone : string
      mail : string
      desc : string
    },
    payment: {
      track_id : string
      amount : string 
      card_no : string
      hashed_card_no : string
      date : string
    },
    verify: {
      date : string
    },
    settlement: {
      track_id : string
      amount : string
      date : string
    }
}