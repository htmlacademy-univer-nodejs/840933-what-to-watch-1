import { ValidationError } from 'class-validator';

import { STATIC_IMAGES } from '../constants/staticImages.constant.js';
import { ValidationErrorField } from '../types/types/validation-error-field.type.js';
import { ServiceError } from '../types/enums/serviceError.enum.js';

const isObject = (value: unknown) =>
  typeof value === 'object' && value !== null;

export const transformProperty = (
  property: string,
  someObject: Record<string, unknown>,
  transformFn: (object: Record<string, unknown>) => void
) => {
  Object.keys(someObject).forEach((key) => {
    if (key === property) {
      transformFn(someObject);
    } else if (isObject(someObject[key])) {
      const obj = Object(someObject[key]);
      transformProperty(property, obj, transformFn);
    }
  });
};

export const transformObject = (
  properties: string[],
  staticPath: string,
  uploadPath: string,
  data: Record<string, unknown>
) => {
  properties.forEach((property) =>
    transformProperty(property, data, (target: Record<string, unknown>) => {
      const file = String(target[property]);

      const rootPath = [
        ...STATIC_IMAGES,
      ].includes(file)
        ? staticPath
        : uploadPath;

      target[property] = `${rootPath}/${file}`;
    })
  );
};

export const transformErrors = (
  errors: ValidationError[]
): ValidationErrorField[] =>
  errors.map(({ property, value, constraints }) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : [],
  }));

export const createErrorObject = (
  serviceError: ServiceError,
  message: string,
  details: ValidationErrorField[] = []
) => ({
  errorType: serviceError,
  message,
  details: [...details],
});
