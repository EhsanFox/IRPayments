export class IPGBaseError extends Error {
  constructor(readonly message: string, readonly errorCode: string | number) {
    super(message);
  }
}
