import axios, { AxiosInstance } from "axios";
import {
  StatusCodes,
  iInquiryResult,
  iRequestResult,
  iVerifyResult,
} from "../../types/drivers/zibal";

export class Zibal {
  private readonly baseUrl = "https://gateway.zibal.ir";
  private Request: AxiosInstance = axios.create({
    baseURL: this.baseUrl,
    headers: { "Content-Type": "application/json" },
  });

  constructor(
    private readonly merchant: string,
    private readonly callbackUrl: string,
    private isLazyMode = false
  ) {}

  public setLazyMode(enable: boolean) {
    this.isLazyMode = enable;
  }

  public async request(
    amount: number,
    opts: {
      description?: string;
      orderId?: string;
      mobile?: string;
      allowedCards?: string[];
      ledgerId?: string;
      linkToPay?: boolean;
      sms?: boolean;
      feeMode?: 0 | 1 | 2;
    } = {},
    isSandbox = false
  ): Promise<{
    statusMessage: string;
    trackId: string;
    result: string | 100 | 102 | 103 | 104 | 105 | 106 | 113;
    message: string;
    payLink?: string;
  }> {
    const res = await this.Request.post<iRequestResult>(
      this.isLazyMode ? "/request/lazy" : "/v1/request",
      {
        merchant: isSandbox ? "zibal" : this.merchant,
        amount,
        callbackUrl: this.callbackUrl,
        ...opts,
      },
      { headers: { "Content-Type": "application/json" }, baseURL: this.baseUrl }
    );

    let statusMessage: string | null = null;
    if (res.data.result) {
      switch (res.data.result) {
        case 100:
          statusMessage = "با موفقیت تایید شد.";
          break;
        case 102:
          statusMessage = "{merchant} یافت نشد.";
          break;
        case 103:
          statusMessage = "{merchant} غیرفعال";
          break;
        case 104:
          statusMessage = "{merchant} نامعتبر";
          break;
        case 105:
          statusMessage = "{amount} بایستی بزرگتر از 1,000 ریال باشد.";
          break;
        case 106:
          statusMessage =
            "{callbackUrl} نامعتبر می‌باشد. (شروع با http و یا https)";
          break;
      }
    }

    return {
      ...res.data,
      statusMessage,
    };
  }

  public startURL(trackId: string) {
    return `https://gateway.zibal.ir/start/${trackId}`;
  }

  public async verify(
    trackId: string,
    isSandbox = false
  ): Promise<{
    statusMessage: string;
    statusCodeMessage: string;
    paidAt: string | Date;
    amount: number;
    result: 100 | 102 | 103 | 104 | 201 | 202 | 203;
    status: number;
    refNumber?: number;
    description?: string;
    cardNumber: string;
    orderId?: string;
    message: string;
  }> {
    const res = await this.Request.post<iVerifyResult>(
      this.isLazyMode ? "/verify" : "/v1/verify",
      {
        merchant: isSandbox ? "zibal" : this.merchant,
        trackId,
      },
      { headers: { "Content-Type": "application/json" }, baseURL: this.baseUrl }
    );

    let statusMessage: string | null = null;
    if (res.data.result) {
      switch (res.data.result) {
        case 100:
          statusMessage = "با موفقیت تایید شد.";
          break;
        case 102:
          statusMessage = "{merchant} یافت نشد.";
          break;
        case 103:
          statusMessage = "{merchant} غیرفعال";
          break;
        case 104:
          statusMessage = "{merchant} نامعتبر";
          break;
        case 201:
          statusMessage = "قبلا تایید شده.";
          break;
        case 202:
          statusMessage = "سفارش پرداخت نشده یا ناموفق بوده است. ";
          break;
        case 203:
          statusMessage = "{trackId} نامعتبر می‌باشد.";
          break;
      }
    }

    return {
      ...res.data,
      statusMessage,
      statusCodeMessage:
        res.data.result == 100
          ? StatusCodes[
              res.data.status.toString() as
                | "-1"
                | "-2"
                | "1"
                | "2"
                | "3"
                | "4"
                | "5"
                | "6"
                | "7"
                | "8"
                | "9"
                | "10"
                | "11"
                | "12"
            ]
          : null,
    };
  }

  public async inquiry(trackId: string, isSandbox = false) {
    const res = await this.Request.post<iInquiryResult>(
      "/v1/inquiry",
      {
        merchant: isSandbox ? "zibal" : this.merchant,
        trackId,
      },
      { headers: { "Content-Type": "application/json" }, baseURL: this.baseUrl }
    );

    let statusMessage: string | null = null;
    if (res.data.result) {
      switch (res.data.result) {
        case 100:
          statusMessage = "با موفقیت تایید شد.";
          break;
        case 102:
          statusMessage = "{merchant} یافت نشد.";
          break;
        case 103:
          statusMessage = "{merchant} غیرفعال";
          break;
        case 104:
          statusMessage = "{merchant} نامعتبر";
          break;
        case 203:
          statusMessage = "{trackId} نامعتبر می‌باشد.";
          break;
      }

      return {
        ...res.data,
        statusMessage,
      };
    }
  }
}
