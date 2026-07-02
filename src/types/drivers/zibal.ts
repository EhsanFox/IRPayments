export type ZBStatusCodes =
  | "-1"
  | -1
  | "-2"
  | -2
  | 1
  | "1"
  | 2
  | "2"
  | 3
  | "3"
  | 4
  | "4"
  | 5
  | "5"
  | 6
  | "6"
  | 7
  | "7"
  | 8
  | "8"
  | 9
  | "9"
  | 10
  | "10"
  | 11
  | "11"
  | 12
  | "12"
  | 15
  | "15"
  | 16
  | "16"
  | 18
  | "18"
  | 21
  | "21";
export type ZBCreatePaymentStatusCodes =
  | 100
  | "100"
  | 102
  | "102"
  | 103
  | "103"
  | 104
  | "104"
  | 105
  | "105"
  | 106
  | "106"
  | 107
  | "107"
  | 108
  | "108"
  | 109
  | "109"
  | 110
  | "110"
  | 111
  | "111"
  | 112
  | "112"
  | 113
  | "113"
  | 114
  | "114"
  | 115
  | "115";

export type ZBVerifyResultCodes =
  | 100
  | "100"
  | 102
  | "102"
  | 103
  | "103"
  | 104
  | "104"
  | 201
  | "201"
  | 202
  | "202"
  | 203
  | "203";
export interface ZBVerifyRawResult extends Record<string, unknown> {
  /** تاریخ پرداخت سفارش - به فرمت ISODate (در صورت موفقیت‌آمیز بودن پرداخت) */
  paidAt: string;
  /** شماره کارت پرداخت کننده (Mask شده) */
  cardNumber: string;
  /** وضعیت پرداخت (به بخش جداول، جدول وضعیت‌ها مراجعه کنید) */
  status: ZBStatusCodes;
  /** مبلغ سفارش (به ریال) */
  amount: number;
  /** شناسه مرجع تراکنش (در صورت موفقیت‌آمیز بودن پرداخت) */
  refNumber: number;
  /** توضیحات تراکنش (در صورت موفقیت‌آمیز بودن پرداخت) */
  description: string;
  /** شناسه سفارش (در صورت موفقیت‌آمیز بودن پرداخت) */
  orderId: string;
  /** نتیجه درخواست (به بخش جداول، جدول کدهای نتیجه تایید پرداخت مراجعه کنید) */
  result: ZBVerifyResultCodes;
  /** پیغام حاوی نتیجه درخواست */
  message: string;
  /** اطلاعات تسهیم تراکنش (در صورت تسهیم‌دار بودن) */
  multiplexingInfos?: MultiplexingInfo[];
}

export interface MultiplexingInfo {
  /** شماره شبا دریافت کننده */
  iban?: string;
  /** مبلغ تسهیم شده به ریال */
  amount?: number;
  /** توضیحات تسهیم */
  description?: string;
  /** وضعیت تسهیم */
  status?: string;
  /** کد خطای تسهیم */
  errorCode?: number;
  [key: string]: unknown;
}

export interface ZBInquiryRawResult extends Record<string, unknown> {
  /** تاریخ ایجاد سفارش - به فرمت ISODate (در صورت موفقیت‌آمیز بودن پرداخت) */
  createdAt: string;
  /** تاریخ پرداخت سفارش - به فرمت ISODate (در صورت موفقیت‌آمیز بودن پرداخت) */
  paidAt: string;
  /** تاریخ تایید سفارش - به فرمت ISODate (در صورت موفقیت‌آمیز بودن پرداخت) */
  verifiedAt: string;
  /** شماره کارت پرداخت کننده (Mask شده) */
  cardNumber: string;
  /** وضعیت پرداخت (به بخش جداول، جدول وضعیت‌ها مراجعه کنید) */
  status: ZBStatusCodes;
  /** مبلغ سفارش (به ریال) */
  amount: number;
  /** شناسه مرجع تراکنش (در صورت موفقیت‌آمیز بودن پرداخت) */
  refNumber: number;
  /** توضیحات تراکنش */
  description: string;
  /** شناسه سفارش */
  orderId: string;
  /** نحوه کسر کارمزد: 0 = کسر از تراکنش، 1 = کسر از کیف پول کارمزد */
  wage: number;
  /** نتیجه درخواست (به بخش جداول، جدول کدهای نتیجه استعلام پرداخت مراجعه کنید) */
  result: ZBVerifyResultCodes;
  /** پیغام حاوی نتیجه درخواست */
  message: string;
  /** اطلاعات تسهیم تراکنش (در صورت تسهیم‌دار بودن) */
  multiplexingInfos?: MultiplexingInfo[];
}

export interface _ZBCreatePaymentObject {
  amount: number;
  callbackUrl: string;
  merchant: string;

  allowedCards?: string[];
  checkMobileWithCard?: boolean;
  description?: string;
  feeMode?: number;
  mobile?: string;
  multiplexingInfos?: MultiplexingInfo[];
  nationalCode?: string;
  orderId?: string;
  percentMode?: number;
}

export interface _ZBCreatePaymentRawResult {
  trackId: number;
  result: ZBCreatePaymentStatusCodes;
  message: string;
}

export interface _ZBVerifyPaymentObject {
  merchant: string;
  trackId: number;
}

export interface _ZBInquiryObject {
  merchant: string;
  trackId: number;
}

export interface ZBRawError<StatusCodes> {
  message: string;
  result: StatusCodes;
}
