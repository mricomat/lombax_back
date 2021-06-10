import { TransformFnParams } from 'class-transformer/types/interfaces';

export const trimStringHelper = (params: TransformFnParams): any => (typeof params.value === 'string' ? params.value.trim() : undefined);
