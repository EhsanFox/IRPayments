export interface IDriverClient<
  CreatePaymentType extends ICreatePaymentRequired &
    ICreatePaymentOptional = ICreatePaymentRequired & ICreatePaymentOptional,
  VerifyPaymentRawType extends Record<string, unknown> = Record<
    string,
    unknown
  >,
  InquiryResultRawType extends Record<string, unknown> = Record<
    string,
    unknown
  >,
> {
  isSandbox: boolean;
  sandbox(
    on: boolean,
  ): ThisType<IDriverClient<CreatePaymentType, VerifyPaymentRawType>>;
  removeHeader(
    key: string,
  ): ThisType<IDriverClient<CreatePaymentType, VerifyPaymentRawType>>;
  addHeader(
    key: string,
    value: string,
    override: boolean,
  ): ThisType<IDriverClient<CreatePaymentType, VerifyPaymentRawType>>;
  setDescription(
    desc: string,
  ): ThisType<IDriverClient<CreatePaymentType, VerifyPaymentRawType>>;
  getDescription(): string;
  setToken(
    token: string,
  ): ThisType<IDriverClient<CreatePaymentType, VerifyPaymentRawType>>;
  getToken(): string;

  createPayment(opts: CreatePaymentType): Promise<ICreatePaymentResult>;
  verifyPayment(
    opts: IVerifyPaymentRequired,
  ): Promise<IVerifyPaymentResult<VerifyPaymentRawType>>;
  inquiryPayment(
    opts: IinquiryPaymentRequired,
  ): Promise<BasePaymentStatus<InquiryResultRawType>>;

  toCreatePaymentResult(raw: unknown): ICreatePaymentResult;
  toVerifyPaymentResult(
    raw: unknown,
  ): IVerifyPaymentResult<VerifyPaymentRawType>;
  toInquiryResult(raw: unknown): BasePaymentStatus<InquiryResultRawType>;

  rebuildHTTP(
    baseURL?: string,
    headerOpts?: Record<string, string>,
  ): ThisType<IDriverClient<CreatePaymentType, VerifyPaymentRawType>>;
}

export interface ICreatePaymentRequired {
  orderId: string;
  amount: string;
  callback_url: string;
  description: string;
}

export interface ICreatePaymentOptional {
  name?: string;
  phone?: string;
  mail?: string;
}

export interface ICreatePaymentResult {
  authorityId: string;
  redirectUrl: string;
}

export interface IVerifyPaymentRequired {
  amount: string;
  orderId: string;
  authorityId: string;
}

export interface IinquiryPaymentRequired {
  authorityId: string;
  orderId: string;
}

export interface IVerifyPaymentResult<RawType>
  extends BasePaymentStatus<RawType> {
  card?: string;
  cardHash?: string;
}

export interface BasePaymentStatus<RawType> {
  status: "paid" | "verified" | "pending" | "failed" | "reversed";
  statusCode: string;
  raw: RawType;
}
