import { FilterByFieldTypeEnum } from '../enums/filter-by-field-type.enum';

export interface FilterByQueryOptionsInterface {
  field: string;
  type: FilterByFieldTypeEnum;
  isArray?: boolean;
  enumValue?: { [key: string]: string } | string[];
}
