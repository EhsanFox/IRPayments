import axios, { AxiosInstance } from "axios";
import {
  BasePaymentStatus,
  ICreatePaymentOptional,
  ICreatePaymentRequired,
  ICreatePaymentResult,
  IDriverClient,
  IinquiryPaymentRequired,
  IVerifyPaymentRequired,
  IVerifyPaymentResult,
} from "../types/structures";
import { IPGBaseError } from "./errors";

export class BaseClient<
  CreatePaymentType extends ICreatePaymentRequired & ICreatePaymentOptional,
  VerifyPaymentRawType extends Record<string, unknown>,
  InquieyResultRawType extends Record<string, unknown>,
> implements
    IDriverClient<
      CreatePaymentType,
      VerifyPaymentRawType,
      InquieyResultRawType
    >
{
  isSandbox: boolean;
  http: AxiosInstance;
  readonly #baseURL: string;
  readonly #headerOpts: Record<string, string>;
  protected token: string;
  #defaultDescription = "Payment Description";
  constructor(
    baseURL: string,
    token: string,
    headerOpts: Record<string, string>,
    isSandbox: boolean,
  ) {
    this.#baseURL = baseURL;
    this.#headerOpts = headerOpts;
    this.token = token;
    this.http = axios.create({
      baseURL: baseURL,
      headers: headerOpts,
    });
    this.isSandbox = isSandbox;
  }

  rebuildHTTP(
    baseURL?: string,
    headerOpts?: Record<string, string>,
  ): ThisType<
    IDriverClient<
      CreatePaymentType,
      VerifyPaymentRawType,
      Record<string, unknown>
    >
  > {
    {
      this.http = axios.create({
        baseURL: baseURL ?? this.#baseURL,
        headers: headerOpts ?? this.#headerOpts,
      });

      return this;
    }
  }

  public removeHeader(key: string) {
    if (!this.#headerOpts[key]) return this;
    delete this.#headerOpts[key];

    return this;
  }

  public addHeader(key: string, value: string, override: boolean) {
    if (this.#headerOpts[key] && override) this.#headerOpts[key] = value;
    else if (this.#headerOpts[key] && !override)
      throw new Error(`${key} already exists in header.`);
    else this.#headerOpts[key] = value;

    return this;
  }

  public setDescription(desc: string) {
    this.#defaultDescription = desc;
    return this;
  }

  public getDescription(): string {
    return this.#defaultDescription;
  }

  public setToken(
    token: string,
  ): ThisType<
    IDriverClient<
      CreatePaymentType,
      VerifyPaymentRawType,
      Record<string, unknown>
    >
  > {
    this.token = token;
    return this;
  }

  public getToken(): string {
    return this.token;
  }

  createPayment(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    opts: ICreatePaymentRequired & ICreatePaymentOptional,
  ): Promise<ICreatePaymentResult> {
    throw new IPGBaseError(
      `Create payment is not initialized in the driver.`,
      500,
    );
  }

  verifyPayment(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    opts: IVerifyPaymentRequired,
  ): Promise<IVerifyPaymentResult<VerifyPaymentRawType>> {
    throw new IPGBaseError(
      `Verify payment is not initialized in the driver.`,
      500,
    );
  }

  inquiryPayment(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    opts: IinquiryPaymentRequired,
  ): Promise<BasePaymentStatus<InquieyResultRawType>> {
    throw new IPGBaseError(
      `Inquiry payment is not initialized in the driver.`,
      500,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toCreatePaymentResult(raw: unknown): ICreatePaymentResult {
    throw new IPGBaseError(
      `toCreatePaymentResult is not initialized in the driver.`,
      500,
    );
  }

  toVerifyPaymentResult(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    raw: unknown,
  ): IVerifyPaymentResult<VerifyPaymentRawType> {
    throw new IPGBaseError(
      `toVerifyPaymentResult is not initialized in the driver.`,
      500,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toInquiryResult(raw: unknown): BasePaymentStatus<InquieyResultRawType> {
    throw new IPGBaseError(
      `toInquiryResult is not initialized in the driver.`,
      500,
    );
  }

  sandbox(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    on: boolean,
  ): ThisType<
    IDriverClient<
      CreatePaymentType,
      VerifyPaymentRawType,
      Record<string, unknown>
    >
  > {
    throw new IPGBaseError(`sandbox is not initialized in the driver.`, 500);
  }
}
