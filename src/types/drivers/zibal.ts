export interface iRequestResult {
  trackId: string;
  result: 100 | 102 | 103 | 104 | 105 | 106 | 113 | string;
  message: string;
  payLink?: string;
}

export interface iVerifyResult {
  paidAt: Date | string;
  amount: number;
  result: 100 | 102 | 103 | 104 | 201 | 202 | 203;
  status: number;
  refNumber?: number;
  description?: string;
  cardNumber: string;
  orderId?: string;
  message: string;
}

export interface iCallbackBody {
  success: "1" | "0";
  trackId: string;
  orderId: string;
  status: null;
  cardNumber: string;
  hashedCardNumber: string;
}

export interface iInquiryResult {
  message: string;
  result: 100 | 102 | 103 | 104 | 203;
  refNumber?: number;
  paidAt?: string | Date;
  verifiedAt?: string | Date;
  status: number;
  amount: number;
  orderId: string;
  description: string;
  cardNumber: string;
  multiplexingInfos: [];
  wage: 0 | 1 | 2;
  createdAt?: string | Date;
}

export const StatusCodes = {
  "-1": "در انتظار پردخت",
  "-2": "خطای داخلی",
  "1": "پرداخت شده - تاییدشده",
  "2": "پرداخت شده - تاییدنشده",
  "3": "لغوشده توسط کاربر",
  "4": "‌شماره کارت نامعتبر می‌باشد.",
  "5": "‌موجودی حساب کافی نمی‌باشد.",
  "6": "رمز واردشده اشتباه می‌باشد.",
  "7": "تعداد درخواست‌ها بیش از حد مجاز می‌باشد.",
  "8": "تعداد پرداخت اینترنتی روزانه بیش از حد مجاز می‌باشد.",
  "9": "مبلغ پرداخت اینترنتی روزانه بیش از حد مجاز می‌باشد.",
  "10": "صادرکننده‌ی کارت نامعتبر می‌باشد.",
  "11": "‌خطای سوییچ",
  "12": "کارت قابل دسترسی نمی‌باشد.",
};
