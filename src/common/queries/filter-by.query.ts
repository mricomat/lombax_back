import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { FilterByQueryOptionsInterface } from '../interfaces/filter-by-query-options.interface';
import { ValidationException } from '../exceptions/validation.exception';
import { FilterByFieldTypeEnum } from '../enums/filter-by-field-type.enum';

export const filterByQueryParamFactory = (options: FilterByQueryOptionsInterface, ctx: ExecutionContext) => {
  const { field, type, enumValue, isArray } = options;
  const request: Request = ctx.switchToHttp().getRequest();
  let values: string | boolean | string[] = request.query[field] as string;

  if (!values) return null;

  if (!enumValue) values = values.trim().toLowerCase();

  if (isArray) values = values.split(',');

  if (type === FilterByFieldTypeEnum.BOOLEAN && values !== 'true' && values !== 'false') {
    throw new ValidationException([
      {
        message: 'This query parameter only accepts "true" or "false" as values',
        path: field,
        validation: 'invalid value',
        value: values as string,
      },
    ]);
  }

  if (type === FilterByFieldTypeEnum.STRING && enumValue) {
    const allowedValues: string[] = enumValue.length ? (enumValue as string[]) : Object.values(enumValue);
    const notAllowedValueError = [
      {
        message: `The ${field} query parameter has an invalid value. The allowed values are ${allowedValues.join(', ')}`,
        path: field,
        validation: 'invalid value',
        value: values as string,
      },
    ];

    if (!isArray && !allowedValues.includes(values as string)) throw new ValidationException(notAllowedValueError);

    if (isArray) {
      for (const value of values) {
        if (!allowedValues.includes(value)) {
          throw new ValidationException(notAllowedValueError);
        }
      }
    }
  }

  if (type === FilterByFieldTypeEnum.BOOLEAN) {
    values = values === 'true';
  }

  return values;
};

export const FilterByQuery = createParamDecorator(filterByQueryParamFactory);
