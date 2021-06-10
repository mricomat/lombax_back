import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
class IsAlphaBlankCustomValidator implements ValidatorConstraintInterface {
  private readonly validationRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s+]*$/;

  validate(text: string, _validationArguments?: ValidationArguments): boolean {
    return this.validationRegex.test(text);
  }
}

export const IsAlphaBlank = (validationOptions?: ValidationOptions) => (object: Object, propertyName: string): void => {
  registerDecorator({
    target: object.constructor,
    propertyName,
    constraints: [],
    options: validationOptions,
    validator: IsAlphaBlankCustomValidator,
  });
};
