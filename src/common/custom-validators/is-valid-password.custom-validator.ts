import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidPasswordCustomValidator implements ValidatorConstraintInterface {
  private readonly passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})|^$/;

  validate(password: string, _validationArguments?: ValidationArguments): boolean {
    return this.passwordRegex.test(password);
  }
}

export const IsValidPassword = (validationOptions?: ValidationOptions) => (object: Object, propertyName: string): void => {
  registerDecorator({
    target: object.constructor,
    propertyName,
    constraints: [],
    options: validationOptions,
    validator: IsValidPasswordCustomValidator,
  });
};
