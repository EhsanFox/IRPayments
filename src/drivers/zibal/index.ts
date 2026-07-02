import BigNumber from "bignumber.js";
import { BaseClient } from "../../structures/client";
import {
  BasePaymentStatus,
  ICreatePaymentOptional,
  ICreatePaymentRequired,
  ICreatePaymentResult,
  IinquiryPaymentRequired,
  IVerifyPaymentRequired,
  IVerifyPaymentResult,
  ZBVerifyRawResult,
  ZBInquiryRawResult,
  _ZBCreatePaymentObject,
  _ZBCreatePaymentRawResult,
  ZBRawError,
  _ZBVerifyPaymentObject,
  ZBCreatePaymentStatusCodes,
  ZBVerifyResultCodes,
  _ZBInquiryObject,
} from "../../types";
import { IPGBaseError } from "../../structures/errors";
import axios, { AxiosError } from "axios";

export class ZibalDriver extends BaseClient<
  ICreatePaymentRequired & ICreatePaymentOptional,
  ZBVerifyRawResult,
  ZBInquiryRawResult
> {
  constructor(
    token: string,
    headerOpts: Record<string, string> = { "Content-Type": "application/json" },
    baseURL = "https://gateway.zibal.ir/",
    isSandbox = false,
    private isLazyMode = true,
  ) {
    super(baseURL, token, headerOpts, isSandbox);
  }

  lazyMode(on: boolean) {
    this.isLazyMode = on;
    return this;
  }

  public getToken(): string {
    if (this.isSandbox) return "zibal";
    else return this.token;
  }

  async createPayment(
    opts: ICreatePaymentRequired & ICreatePaymentOptional,
  ): Promise<ICreatePaymentResult> {
    const { amount, callback_url, phone } = opts;
    const zbObj: _ZBCreatePaymentObject = {
      amount: BigNumber(amount).toNumber(),
      callbackUrl: callback_url,
      merchant: this.getToken(),
    };
    if (phone) zbObj.mobile = phone;

    try {
      const result = await this.http.post<_ZBCreatePaymentRawResult>(
        this.isLazyMode ? "/request/lazy" : "/v1/request",
        zbObj,
      );
      if (
        (result.data.result === 100 || result.data.result === "100") &&
        (result.status === 200 || result.status === 201)
      )
        return this.toCreatePaymentResult(result.data);
      else throw new IPGBaseError(result.data.message, result.data.result);
    } catch (error) {
      if (!axios.isAxiosError(error)) throw error;

      const err: AxiosError<ZBRawError<ZBCreatePaymentStatusCodes>> = error;
      if (!err.response) throw new IPGBaseError(err.message, err.code ?? 500);

      throw new IPGBaseError(
        err.response.data.message,
        err.response.data.result,
      );
    }
  }

  async verifyPayment(
    opts: IVerifyPaymentRequired,
  ): Promise<IVerifyPaymentResult<ZBVerifyRawResult>> {
    const { authorityId } = opts;

    const zbObj: _ZBVerifyPaymentObject = {
      trackId: Number(authorityId),
      merchant: this.getToken(),
    };
    try {
      const result = await this.http.post<ZBVerifyRawResult>(
        this.isLazyMode ? "/verify" : "/v1/verify",
        zbObj,
      );

      if (
        (result.data.result === 100 ||
          result.data.result === "100" ||
          result.data.result === 201 ||
          result.data.result === "201") &&
        (result.status === 200 || result.status === 201)
      )
        return this.toVerifyPaymentResult(result.data);
      else throw new IPGBaseError(result.data.message, result.data.result);
    } catch (error) {
      if (!axios.isAxiosError(error)) throw error;

      const err: AxiosError<ZBRawError<ZBVerifyResultCodes>> = error;
      if (!err.response) throw new IPGBaseError(err.message, err.code ?? 500);

      throw new IPGBaseError(
        err.response.data.message,
        err.response.data.result,
      );
    }
  }

  async inquiryPayment(
    opts: IinquiryPaymentRequired,
  ): Promise<BasePaymentStatus<ZBInquiryRawResult>> {
    const { authorityId } = opts;

    const zbObj: _ZBInquiryObject = {
      trackId: Number(authorityId),
      merchant: this.getToken(),
    };

    try {
      const result = await this.http.post<ZBInquiryRawResult>(
        "/v1/inquiry",
        zbObj,
      );

      if (
        (result.data.result === 100 ||
          result.data.result === "100" ||
          result.data.result === 201 ||
          result.data.result === "201") &&
        (result.status === 200 || result.status === 201)
      )
        return this.toInquiryResult(result.data);
      else throw new IPGBaseError(result.data.message, result.data.result);
    } catch (error) {
      if (!axios.isAxiosError(error)) throw error;

      const err: AxiosError<ZBRawError<ZBVerifyResultCodes>> = error;
      if (!err.response) throw new IPGBaseError(err.message, err.code ?? 500);

      throw new IPGBaseError(
        err.response.data.message,
        err.response.data.result,
      );
    }
  }

  toCreatePaymentResult(raw: _ZBCreatePaymentRawResult): ICreatePaymentResult {
    return {
      authorityId: raw.trackId.toString(),
      redirectUrl: `https://gateway.zibal.ir/start/${raw.trackId}/`,
    };
  }

  toVerifyPaymentResult(
    raw: ZBVerifyRawResult,
  ): IVerifyPaymentResult<ZBVerifyRawResult> {
    return {
      status:
        raw.status === "1" || raw.status === 1
          ? "verified"
          : raw.status === "2" || raw.status === 2
          ? "paid"
          : raw.status === "-1" || raw.status === -1
          ? "pending"
          : raw.status === "3" ||
            raw.status === 3 ||
            raw.status === "16" ||
            raw.status === 16 ||
            raw.status === "18" ||
            raw.status === 18 ||
            raw.status === 15 ||
            raw.status === "15"
          ? "reversed"
          : "failed",
      statusCode: String(raw.status),
      card:
        raw.status === "1" ||
        raw.status === 1 ||
        raw.status === 2 ||
        raw.status === "2"
          ? raw.cardNumber
          : undefined,
      cardHash:
        raw.status === "1" ||
        raw.status === 1 ||
        raw.status === 2 ||
        raw.status === "2"
          ? raw.cardNumber
          : undefined,
      raw,
    };
  }

  toInquiryResult(
    raw: ZBInquiryRawResult,
  ): BasePaymentStatus<ZBInquiryRawResult> {
    return {
      status:
        raw.status === "1" || raw.status === 1
          ? "verified"
          : raw.status === "2" || raw.status === 2
          ? "paid"
          : raw.status === "-1" || raw.status === -1
          ? "pending"
          : raw.status === "3" ||
            raw.status === 3 ||
            raw.status === "16" ||
            raw.status === 16 ||
            raw.status === "18" ||
            raw.status === 18 ||
            raw.status === 15 ||
            raw.status === "15"
          ? "reversed"
          : "failed",
      statusCode: String(raw.status),
      raw,
    };
  }
}
