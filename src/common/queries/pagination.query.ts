import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ValidationException } from '../exceptions/validation.exception';
import { ValidationError } from '../errors/validation.error';
import { ErrorMessages } from '../../utils/error-messages';

export interface PaginationQueryInterface {
  take: number;
  skip: number;
}

enum PaginationParams {
  TAKE = 'take',
  SKIP = 'skip',
}

function validatePaginationParams(take: string, skip: string): PaginationQueryInterface {
  take = take || '20';
  skip = skip || '0';

  const takeNumber = Number.parseInt(take, 10);
  const skipNumber = Number.parseInt(skip, 10);
  const errors: ValidationError[] = [];

  if (take && Number.isNaN(takeNumber)) {
    errors.push({
      value: take,
      validation: 'take parameter must be a number',
      message: ErrorMessages.TakeQueryParamIsNotNumber,
      path: PaginationParams.TAKE,
    });
  }

  if (skip && Number.isNaN(skipNumber)) {
    errors.push({
      value: skip,
      validation: 'skip parameter must be a number',
      message: ErrorMessages.SkipQueryParamIsNotNumber,
      path: PaginationParams.SKIP,
    });
  }

  if (errors.length) throw new ValidationException(errors);

  return {
    take: takeNumber,
    skip: skipNumber,
  };
}

export const paginationQueryParamFactory = (_: void, ctx: ExecutionContext): PaginationQueryInterface => {
  const request: Request = ctx.switchToHttp().getRequest();
  const take = (request.query?.take as string) || '';
  const skip = (request.query?.skip as string) || '';

  return validatePaginationParams(take, skip);
};

export const PaginationQuery = createParamDecorator(paginationQueryParamFactory);
