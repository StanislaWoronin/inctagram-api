import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserFacade } from '../users/application-services';

@ValidatorConstraint({ name: 'IsConfirmationCodeExist', async: true })
@Injectable()
export class IsRecoveryCodeExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly userFacade: UserFacade) {}

  async validate(value: number) {
    const user = await this.userFacade.queries.getUserByRecoveryCode(value);
    if (!user) {
      return null;
    }
    if (!user.emailConfirmation.isConfirmed) {
      return null;
    }
    if (user.passwordRecoveryCode !== value) {
      return null;
    }
    if (user.passwordRecoveryCode < Date.now()) {
      return null;
    }
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `Incorrect ${args.property} .`;
  }
}

export function IsRecoveryCodeExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsRecoveryCodeExistConstraint,
    });
  };
}
