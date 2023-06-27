import { faker } from '@faker-js/faker';
import { userValidationConstant } from '../../libs/users/user-validation.constant';

const validLogin = 'UserName';
const validEmail = 'somemail@gmail.com';
const validPassword = 'qwerty123';
const minLoginLength = userValidationConstant.nameLength.min;
const maxLoginLength = userValidationConstant.nameLength.max;
const minPasswordLength = userValidationConstant.passwordLength.min;
const maxPasswordLength = userValidationConstant.passwordLength.max;
const shortPassword = faker.string.alpha({
  length: { min: minPasswordLength - 1, max: minPasswordLength - 1 },
});
const longPassword = faker.string.alpha({
  length: { min: maxPasswordLength + 1, max: maxPasswordLength + 1 },
});

export const preparedRegistrationData = {
  valid: {
    userName: validLogin,
    email: validEmail,
    password: validPassword,
    passwordConfirmation: validPassword,
  },
  incorrect: {
    short: {
      userName: faker.string.alpha({
        length: { min: maxLoginLength + 1, max: maxLoginLength + 1 },
      }),
      email: 'somemailgmail.com',
      password: shortPassword,
      passwordConfirmation: shortPassword,
    },
    long: {
      userName: faker.string.alpha({
        length: { min: minLoginLength - 1, max: minLoginLength - 1 },
      }),
      email: 'somemailgmail.com',
      password: longPassword,
      passwordConfirmation: longPassword,
    },
  },
};

export const preparedLoginData = {
  valid: {
    email: validEmail,
    password: validPassword,
  },
  incorrect: {
    email: validEmail + 1,
    password: validPassword + 1,
  }
};
