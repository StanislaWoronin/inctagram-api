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
export class IsConfirmationCodeExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly userFacade: UserFacade) {}

  async validate(value: number) {
    console.log({value})
    const user = await this.userFacade.queries.getUserByConfirmationCode(value);
    return !user;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} is incorrect.`;
  }
}

export function IsConfirmationCodeExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsConfirmationCodeExistConstraint,
    });
  };
}
