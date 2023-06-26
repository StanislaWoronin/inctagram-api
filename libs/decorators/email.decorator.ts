import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserFacade } from '../users/application-services';

@ValidatorConstraint({ name: 'IsEmailExist', async: true })
@Injectable()
export class IsEmailExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userFacade: UserFacade) {}

  async validate(value: string) {
    const user = await this.userFacade.queries.getUserByIdOrUserNameOrEmail(
      value,
    );
    return !!user;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} not exist.`;
  }
}

export function IsEmailExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailExistConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsEmailExistForRegistration', async: true })
@Injectable()
export class IsEmailExistForRegistrationConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly userFacade: UserFacade) {}

  async validate(value: string) {
    const user = await this.userFacade.queries.getUserByIdOrUserNameOrEmail(
      value,
    );
    return !user;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} already exists.`;
  }
}

export function IsEmailExistForRegistration(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailExistForRegistrationConstraint,
    });
  };
}
