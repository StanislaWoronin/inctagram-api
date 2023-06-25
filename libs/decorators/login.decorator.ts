import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserFacade } from '../users/application-services';

@ValidatorConstraint({ name: 'IsLoginExist', async: true })
@Injectable()
export class IsLoginExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userFacade: UserFacade) {}

  async validate(value: string) {
    const user = await this.userFacade.queries.getUserByIdOrLoginOrEmail(value);
    return !user;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} already exists.`;
  }
}

export function IsLoginExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsLoginExistConstraint,
    });
  };
}
