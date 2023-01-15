import { StatusCodes } from 'http-status-codes';

import { ValidationErrorField } from '../../types/types/validation-error-field.type.js';

export class ValidationError extends Error {
  httpStatusCode!: number;
  details: ValidationErrorField[] = [];

  constructor(message: string, errors: ValidationErrorField[]) {
    super(message);

    this.httpStatusCode = StatusCodes.BAD_REQUEST;
    this.message = message;
    this.details = errors;
  }
}
