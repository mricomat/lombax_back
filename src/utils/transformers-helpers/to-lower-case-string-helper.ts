import { TransformFnParams } from 'class-transformer/types/interfaces';

export const toLowerCaseStringHelper = (params: TransformFnParams): any =>
  typeof params.value === 'string' ? params.value.toLowerCase() : undefined;
