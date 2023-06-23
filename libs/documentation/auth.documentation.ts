import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RegistrationDto } from '../../apps/auth/dto/registration.dto';
import { LoginDto } from '../../apps/auth/dto/login.dto';
import { ResendingEmailConfirmationDto } from '../../apps/auth/dto/resending-email-confirmation.dto';
import { RegistrationConfirmationDto } from '../../apps/auth/dto/registration-confirmation.dto';
import { PasswordRecoveryDto } from '../../apps/auth/dto/password-recovery.dto';
import { NewPasswordDto } from '../../apps/auth/dto/new-password.dto';

export function ApiRegistration() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({ summary: 'A new user is registered in the system' }),
    ApiBody({
      type: RegistrationDto,
      required: true,
    }),
    ApiNoContentResponse({
      description:
        'Input data is accepted. Email with confirmation code will be send to' +
        ' passed email address',
    }),
    ApiBadRequestResponse({
      description:
        'If the inputModel has incorrect values (in particular if the user with' +
        ' the given email or password already exists)',
      //type: [BadRequestResponse],
    }),
    // ApiTooManyRequestsResponse({
    //   description: 'More than 5 attempts from one IP-address during 10 seconds',
    // }),
  );
}

export function ApiLogin() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({ summary: 'New user login after registration' }),
    ApiBody({ type: LoginDto }),
    ApiOkResponse({
      description:
        'Returns JWT accessToken (expired after 1 hour) in body and JWT' +
        ' refreshToken in cookie (http-only, secure) (expired after 20 seconds)',
      //type: AccessToken,
    }),
    // ApiBadRequestResponse({
    //     description: 'If the inputModel has incorrect values',
    //     //type: [BadRequestResponse],
    // }),
    ApiUnauthorizedResponse({
      description: 'If the password or login is wrong',
    }),
    // ApiTooManyRequestsResponse({
    //   description: 'More than 5 attempts from one IP-address during 10 seconds',
    // }),
  );
}

export function ApiRegistrationEmailResending() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({ summary: 'Re-sends registration confirmation code' }),
    ApiBody({
      type: ResendingEmailConfirmationDto,
      required: true,
    }),
    ApiNoContentResponse({
      description:
        'Input data is accepted.Email with confirmation code will be send to passed' +
        ' email address.Confirmation code should be inside link as query param,' +
        ' for example: https://some-front.com/confirm-registration?code=yourCodeHere',
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
      //type: [BadRequestResponse],
    }),
    // ApiTooManyRequestsResponse({
    //   description: 'More than 5 attempts from one IP-address during 10 seconds',
    // }),
  );
}

export function ApiRegistrationConfirmation() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({
      summary: 'Confirmation of registration via confirmation code',
    }),
    ApiBody({
      type: RegistrationConfirmationDto,
      required: true,
    }),
    ApiNoContentResponse({
      description: 'Email was verified. Account was activated',
    }),
    ApiBadRequestResponse({
      description:
        'If the confirmation code is incorrect, expired or already been applied',
      //type: [BadRequestResponse],
    }),
    // ApiTooManyRequestsResponse({
    //   description: 'More than 5 attempts from one IP-address during 10 seconds',
    // }),
  );
}

export function ApiPasswordRecovery() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({ summary: 'Password recovery request' }),
    ApiBody({
      type: PasswordRecoveryDto,
      required: true,
    }),
    ApiNoContentResponse({
      description:
        "Even if current email is not registered (for prevent user's email detection)",
    }),
    ApiBadRequestResponse({
      description:
        'If the inputModel has invalid email (for example 222^gmail.com)',
      //type: BadRequestResponse,
    }),
    // ApiTooManyRequestsResponse({
    //   description: 'More than 5 attempts from one IP-address during 10 seconds',
    // }),
  );
}

export function ApiNewPassword() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({ summary: 'Sending a new password' }),
    ApiBody({
      type: NewPasswordDto,
      required: true,
    }),
    ApiNoContentResponse({
      description: 'If code is valid and new password is accepted',
    }),
    ApiBadRequestResponse({
      description:
        'If the inputModel has incorrect value (for incorrect password length) or' +
        ' RecoveryCode is incorrect or expired or old password equil new password',
      //type: BadRequestResponse,
    }),
    // ApiTooManyRequestsResponse({
    //   description: 'More than 5 attempts from one IP-address during 10 seconds',
    // }),
  );
}

export function ApiRefreshToken() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({ summary: 'Update authorization tokens' }),
    ApiOkResponse({
      description:
        'Returns JWT accessToken (expired after 1 hour) in body and JWT' +
        ' refreshToken in cookie (http-only, secure) (expired after 24 hours).',
      //type: AccessToken,
    }),
    ApiUnauthorizedResponse({
      description:
        'Returns JWT accessToken (expired after 1 hour) in body and JWT' +
        ' refreshToken in cookie (http-only, secure) (expired after 24 hours).',
    }),
  );
}

export function ApiLogout() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({ summary: 'User logout' }),
    ApiBearerAuth(),
    ApiNoContentResponse({
      description: 'No Content',
    }),
    ApiUnauthorizedResponse({
      description:
        'If the JWT refreshToken inside cookie is missing, expired or incorrect',
    }),
  );
}

export function ApiDropDatabase() {
  return applyDecorators(
    ApiTags('Delete data /Dev endpoint'),
    ApiOperation({
      summary: 'Clear database: delete all data from all tables/collections',
    }),
    ApiNoContentResponse({
      description: 'All data is deleted',
    }),
  );
}
