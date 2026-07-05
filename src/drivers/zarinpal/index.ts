import BigNumber from "bignumber.js";
import { BaseClient } from "../../structures/client";
import { randomUUID } from "node:crypto";
import {
  BasePaymentStatus,
  ICreatePaymentOptional,
  ICreatePaymentRequired,
  ICreatePaymentResult,
  ZPVerifyRawResult,
  IinquiryPaymentRequired,
  IVerifyPaymentRequired,
  IVerifyPaymentResult,
  ZPInquiryRawResult,
  _ZPRawCreatePaymentObject,
  _ZPCreatePaymentRawResult,
  _ZPVerifyPaymentObject,
  _ZPInquiryObject,
  IDriverClient,
} from "../../types";
import { IPGBaseError } from "../../structures/errors";
import axios, { AxiosError } from "axios";

export class ZarinpalDriver extends BaseClient<
  ICreatePaymentRequired & ICreatePaymentOptional,
  ZPVerifyRawResult,
  ZPInquiryRawResult
> {
  constructor(
    token: string,
    isSandbox = false,
    headerOpts: Record<string, string> = {},
    baseURL = "https://payment.zarinpal.com/pg/v4/payment",
  ) {
    super(baseURL, token, headerOpts, isSandbox);
    this.sandbox(isSandbox);
  }

  sandbox(
    on: boolean,
  ): ThisType<
    IDriverClient<
      ICreatePaymentRequired & ICreatePaymentOptional,
      ZPVerifyRawResult,
      Record<string, unknown>
    >
  > {
    if (on) this.rebuildHTTP("https://sandbox.zarinpal.com/");
    else this.rebuildHTTP();

    return this;
  }

  public getToken(): string {
    if (this.isSandbox) return randomUUID();
    else return this.token;
  }

  async createPayment(
    opts: ICreatePaymentRequired &
      ICreatePaymentOptional & {
        currency?: "IRR" | "IRT";
        referrer_id?: string;
      },
  ): Promise<ICreatePaymentResult> {
    const {
      orderId,
      amount,
      callback_url,
      phone,
      mail,
      description,
      currency,
      referrer_id,
    } = opts;
    const zpObj: _ZPRawCreatePaymentObject = {
      order_id: orderId,
      amount: BigNumber(amount).toNumber(),
      callback_url: callback_url,
      description: description ?? this.getDescription(),
      merchant_id: this.getToken(),
      currency: currency ?? "IRR",
      referrer_id: referrer_id ?? "",
    };
    if (phone) {
      if (!zpObj.metadata) zpObj.metadata = {};
      zpObj.mobile = phone;
      zpObj.metadata.mobile = phone;
    }
    if (mail) {
      if (!zpObj.metadata) zpObj.metadata = {};
      zpObj.email = mail;
      zpObj.metadata.email = mail;
    }

    try {
      const result = await this.http.post<_ZPCreatePaymentRawResult>(
        "/request.json",
        zpObj,
      );
      if (result.status === 200 || result.status === 201)
        return this.toCreatePaymentResult(result.data);
      else
        throw new IPGBaseError(
          result.data.errors.toString(),
          result.data.data.code,
        );
    } catch (error) {
      if (!axios.isAxiosError(error)) throw error;

      const err: AxiosError<_ZPCreatePaymentRawResult> = error;
      if (!err.response) throw new IPGBaseError(err.message, err.code ?? 500);

      throw new IPGBaseError(
        err.response.data.errors.toString(),
        err.response.data.data.code,
      );
    }
  }

  async verifyPayment(
    opts: IVerifyPaymentRequired,
  ): Promise<IVerifyPaymentResult<ZPVerifyRawResult>> {
    const { authorityId, amount } = opts;

    const zpObj: _ZPVerifyPaymentObject = {
      amount: BigNumber(amount).toNumber(),
      authority: authorityId,
      merchant_id: this.getToken(),
    };
    try {
      const result = await this.http.post<ZPVerifyRawResult>(
        "/verify.json",
        zpObj,
      );

      if (result.status === 200 || result.status === 201)
        return this.toVerifyPaymentResult(result.data);
      else
        throw new IPGBaseError(
          result.data.errors.toString(),
          result.data.data.code,
        );
    } catch (error) {
      if (!axios.isAxiosError(error)) throw error;

      const err: AxiosError<_ZPCreatePaymentRawResult> = error;
      if (!err.response) throw new IPGBaseError(err.message, err.code ?? 500);

      throw new IPGBaseError(
        err.response.data.errors.toString(),
        err.response.data.data.code,
      );
    }
  }

  async inquiryPayment(
    opts: IinquiryPaymentRequired,
  ): Promise<BasePaymentStatus<ZPInquiryRawResult>> {
    const { authorityId } = opts;

    const zpObj: _ZPInquiryObject = {
      authority: authorityId,
      merchant_id: this.getToken(),
    };

    try {
      const result = await this.http.post<ZPInquiryRawResult>(
        "/inquiry.json",
        zpObj,
      );

      if (result.status === 200 || result.status === 201)
        return this.toInquiryResult(result.data);
      else
        throw new IPGBaseError(
          result.data.errors.toString(),
          result.data.data.code,
        );
    } catch (error) {
      if (!axios.isAxiosError(error)) throw error;

      const err: AxiosError<_ZPCreatePaymentRawResult> = error;
      if (!err.response) throw new IPGBaseError(err.message, err.code ?? 500);

      throw new IPGBaseError(
        err.response.data.errors.toString(),
        err.response.data.data.code,
      );
    }
  }

  toCreatePaymentResult(raw: _ZPCreatePaymentRawResult): ICreatePaymentResult {
    return {
      authorityId: raw.data.authority,
      redirectUrl: `https://payment.zarinpal.com/pg/StartPay/${raw.data.authority}`,
    };
  }

  toVerifyPaymentResult(
    raw: ZPVerifyRawResult,
  ): IVerifyPaymentResult<ZPVerifyRawResult> {
    return {
      status:
        raw.data.code === "101" || raw.data.code === 101
          ? "verified"
          : raw.data.code === "100" || raw.data.code === 100
          ? "paid"
          : raw.data.code === "-51" || raw.data.code === -51
          ? "failed"
          : raw.data.code === "-61" || raw.data.code === -61
          ? "reversed"
          : raw.data.code === "-50" || raw.data.code === -50
          ? "failed" // Amount mismatch - payment failed
          : raw.data.code === "-54" || raw.data.code === -54
          ? "failed" // Invalid authority
          : raw.data.code === "-55" || raw.data.code === -55
          ? "failed" // Transaction not found
          : raw.data.code === "-22" || raw.data.code === -22
          ? "failed" // Transaction failed
          : raw.data.code === "-21" || raw.data.code === -21
          ? "failed" // No financial operation found
          : "failed",
      statusCode: raw.data.code as string,
      card:
        raw.data.code === "101" ||
        raw.data.code === 101 ||
        raw.data.code === "100" ||
        raw.data.code === 100
          ? raw.data.card_pan
          : undefined,
      cardHash:
        raw.data.code === "101" ||
        raw.data.code === 101 ||
        raw.data.code === "100" ||
        raw.data.code === 100
          ? raw.data.card_hash
          : undefined,
      raw,
    };
  }

  toInquiryResult(
    raw: ZPInquiryRawResult,
  ): BasePaymentStatus<ZPInquiryRawResult> {
    return {
      status:
        raw.data.code === "101" || raw.data.code === 101
          ? "verified"
          : raw.data.code === "100" || raw.data.code === 100
          ? "paid"
          : raw.data.code === "-51" || raw.data.code === -51
          ? "failed"
          : raw.data.code === "-61" || raw.data.code === -61
          ? "reversed"
          : raw.data.code === "-50" || raw.data.code === -50
          ? "failed" // Amount mismatch - payment failed
          : raw.data.code === "-54" || raw.data.code === -54
          ? "failed" // Invalid authority
          : raw.data.code === "-55" || raw.data.code === -55
          ? "failed" // Transaction not found
          : raw.data.code === "-22" || raw.data.code === -22
          ? "failed" // Transaction failed
          : raw.data.code === "-21" || raw.data.code === -21
          ? "failed" // No financial operation found
          : "failed",
      statusCode: raw.data.code as string,
      raw,
    };
  }
}
