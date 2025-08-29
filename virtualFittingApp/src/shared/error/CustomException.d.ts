declare let CustomException: ICustomExceptionConstructor;

interface ICustomException extends Error {
  status: ErrorType;
}

interface ICustomExceptionConstructor {
  new (status?: ErrorType, message?: string): ICustomException;
  (status?: ErrorType, message?: string): ICustomException;
}

type ErrorType = number;
