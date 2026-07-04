import BigNumber from "bignumber.js";
import { BaseClient } from "../../structures/client";
import {
  _IDPayRawCreatePaymentObject,
  _IDPayRawCreatePaymentResult,
  _IDPayRawInquiryObject,
  _IDPayRawVerifyPaymentObject,
  BasePaymentStatus,
  ICreatePaymentOptional,
  ICreatePaymentRequired,
  ICreatePaymentResult,
  IDPayInquiryRawResult,
  IDPayRawError,
  IDPayVerifyRawResult,
  IDriverClient,
  IinquiryPaymentRequired,
  IVerifyPaymentRequired,
  IVerifyPaymentResult,
} from "../../types";
import { IPGBaseError } from "../../structures/errors";
import axios, { AxiosError } from "axios";

export class IDPayDriver extends BaseClient<
  ICreatePaymentRequired & ICreatePaymentOptional,
  IDPayVerifyRawResult,
  IDPayInquiryRawResult
> {
  constructor(
    token: string,
    isSandbox = false,
    headerOpts: Record<string, string> = {},
    baseURL = "https://api.idpay.ir/v1.1",
  ) {
    super(baseURL, token, headerOpts, isSandbox);
    this.sandbox(isSandbox);
  }

  sandbox(
    on: boolean,
  ): ThisType<
    IDriverClient<
      ICreatePaymentRequired & ICreatePaymentOptional,
      IDPayVerifyRawResult,
      Record<string, unknown>
    >
  > {
    if (on) this.addHeader("X-SANDBOX", "1", true);
    else this.addHeader("X-SANDBOX", "0", true);

    return this;
  }

  async createPayment(
    opts: ICreatePaymentRequired & ICreatePaymentOptional,
  ): Promise<ICreatePaymentResult> {
    const { orderId, amount, callback_url, name, phone, mail } = opts;
    const idpayObj: _IDPayRawCreatePaymentObject = {
      order_id: orderId,
      amount: BigNumber(amount).toNumber(),
      callback: callback_url,
    };
    if (name) idpayObj.name = name;
    if (phone) idpayObj.phone = phone;
    if (mail) idpayObj.mail = mail;

    try {
      const result = await this.http.post<_IDPayRawCreatePaymentResult>(
        "/payment",
        idpayObj,
      );
      if (result.status === 200 || result.status === 201)
        return this.toCreatePaymentResult(result.data);
      else
        throw new IPGBaseError(
          (result.data as unknown as IDPayRawError).error_message,
          (result.data as unknown as IDPayRawError).error_code,
        );
    } catch (error) {
      if (!axios.isAxiosError(error)) throw error;

      const err: AxiosError<IDPayRawError> = error;
      if (!err.response) throw new IPGBaseError(err.message, err.code ?? 500);

      throw new IPGBaseError(
        err.response.data.error_message,
        err.response.data.error_code,
      );
    }
  }

  async verifyPayment(
    opts: IVerifyPaymentRequired,
  ): Promise<IVerifyPaymentResult<IDPayVerifyRawResult>> {
    const { authorityId, orderId } = opts;

    const idpayObj: _IDPayRawVerifyPaymentObject = {
      id: authorityId,
      order_id: orderId,
    };
    try {
      const result = await this.http.post<IDPayVerifyRawResult>(
        "/payment/verify",
        idpayObj,
      );

      if (result.status === 200 || result.status === 201)
        return this.toVerifyPaymentResult(result.data);
      else
        throw new IPGBaseError(
          (result.data as unknown as IDPayRawError).error_message,
          (result.data as unknown as IDPayRawError).error_code,
        );
    } catch (error) {
      if (!axios.isAxiosError(error)) throw error;

      const err: AxiosError<IDPayRawError> = error;
      if (!err.response) throw new IPGBaseError(err.message, err.code ?? 500);

      throw new IPGBaseError(
        err.response.data.error_message,
        err.response.data.error_code,
      );
    }
  }

  async inquiryPayment(
    opts: IinquiryPaymentRequired,
  ): Promise<BasePaymentStatus<IDPayInquiryRawResult>> {
    const { authorityId, orderId } = opts;

    const idpayObj: _IDPayRawInquiryObject = {
      id: authorityId,
      order_id: orderId,
    };

    try {
      const result = await this.http.post<IDPayInquiryRawResult>(
        "/payment/inquiry",
        idpayObj,
      );

      if (result.status === 200 || result.status === 201)
        return this.toInquiryResult(result.data);
      else
        throw new IPGBaseError(
          (result.data as unknown as IDPayRawError).error_message,
          (result.data as unknown as IDPayRawError).error_code,
        );
    } catch (error) {
      if (!axios.isAxiosError(error)) throw error;

      const err: AxiosError<IDPayRawError> = error;
      if (!err.response) throw new IPGBaseError(err.message, err.code ?? 500);

      throw new IPGBaseError(
        err.response.data.error_message,
        err.response.data.error_code,
      );
    }
  }

  toCreatePaymentResult(
    raw: _IDPayRawCreatePaymentResult,
  ): ICreatePaymentResult {
    return {
      authorityId: raw.id,
      redirectUrl: raw.link,
    };
  }

  toVerifyPaymentResult(
    raw: IDPayVerifyRawResult,
  ): IVerifyPaymentResult<IDPayVerifyRawResult> {
    return {
      status:
        raw.status === "200" || raw.status === "101" || raw.status === "100"
          ? "verified"
          : raw.status === "10"
          ? "paid"
          : raw.status === "1" || raw.status === "5" || raw.status === "8"
          ? "pending"
          : raw.status === "7" || raw.status === "6" || raw.status === "4"
          ? "reversed"
          : "failed",
      statusCode: raw.status as string,
      card:
        raw.status === "200" || raw.status === "100" || raw.status === "101"
          ? raw.payment.card_no
          : undefined,
      cardHash:
        raw.status === "200" || raw.status === "100" || raw.status === "101"
          ? raw.payment.hashed_card_no
          : undefined,
      raw,
    };
  }

  toInquiryResult(
    raw: IDPayInquiryRawResult,
  ): BasePaymentStatus<IDPayInquiryRawResult> {
    return {
      status:
        raw.status === "200" || raw.status === "101" || raw.status === "100"
          ? "verified"
          : raw.status === "10"
          ? "paid"
          : raw.status === "1" || raw.status === "5" || raw.status === "8"
          ? "pending"
          : raw.status === "7" || raw.status === "6" || raw.status === "4"
          ? "reversed"
          : "failed",
      statusCode: raw.status as string,
      raw,
    };
  }
}
