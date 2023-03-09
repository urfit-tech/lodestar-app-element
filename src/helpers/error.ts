export class BackendServerError extends Error {
  public readonly code: string
  constructor(code: string, message: string) {
    super(message)
    this.code = code
  }
}
export class InputError extends BackendServerError {
  constructor(message: string) {
    super('E_INPUT', message)
  }
}
export class SessionError extends BackendServerError {
  constructor(message: string) {
    super('E_SESSION', message)
  }
}
export class NoModuleError extends BackendServerError {
  constructor(message: string) {
    super('E_NO_MODULE', message)
  }
}
export class SendEmailError extends BackendServerError {
  constructor(message: string) {
    super('E_SEND_EMAIL', message)
  }
}
export class PasswordError extends BackendServerError {
  constructor(message: string) {
    super('E_PASSWORD', message)
  }
}
export class NoMemberError extends BackendServerError {
  constructor(message: string) {
    super('E_NO_MEMBER', message)
  }
}
export class BindDeviceError extends BackendServerError {
  constructor(message: string) {
    super('E_BIND_DEVICE', message)
  }
}
export class LoginDeviceError extends BackendServerError {
  constructor(message: string) {
    super('E_LOGIN_DEVICE', message)
  }
}
