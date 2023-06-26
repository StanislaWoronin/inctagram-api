import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  RegistrationDto,
  LoginDto,
  EmailDto,
  RegistrationConfirmationDto,
  NewPasswordDto,
} from '../../../apps/auth/dto';
import { TokenResponse, ViewUser } from '../../users/response';
import {ErrorResponse} from "../../shared/errors.response";

export function ApiRegistration() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({ summary: 'A new user is registered in the system' }),
    ApiBody({
      type: RegistrationDto,
      required: true,
    }),
    ApiCreatedResponse({
      description:
          'Input data is accepted. Email with confirmation code will be send to' +
          ' passed email address. If the user was registered earlier, but did' +
          ' not confirm his email, you need to delete his old data and allow' +
          ' him to register again.',
      type: ViewUser,
    }),
    ApiBadRequestResponse({
      description:
        'If the inputModel has incorrect values (in particular if the user with' +
        ' the given email or password already exists)',
      type: ErrorResponse,
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
        'Returns JWT accessToken (expired after 10 seconds) in body and JWT' +
        ' refreshToken in cookie (http-only, secure) (expired after 20 seconds)',
      type: TokenResponse,
    }),
    // ApiBadRequestResponse({
    //   description:
    //     'If the inputModel has incorrect values (in particular if the user with' +
    //     ' the given email or password already exists)',
    //   type: ErrorResponse,
    // }), TODO 400 не нужна
    ApiUnauthorizedResponse({
      description: 'if a user with such an email does not exist or the password' +
          ' is not suitable for the profile registered with this email',
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
      type: EmailDto,
      required: true,
    }),
    ApiNoContentResponse({
      description:
        'Input data is accepted.Email with confirmation code will be send to passed' +
        ' email address.Confirmation code should be inside link as query param,' +
        ' for example: https://some-front.com/confirm-registration?code=yourCodeHere',
    }),
    ApiBadRequestResponse({
      description:
        'If the inputModel has incorrect values (in particular if the user with' +
        ' the given email or password already exists)',
      type: ErrorResponse,
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
        'If confirmation code incorrect or expired.',
      type: ErrorResponse,
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
      type: EmailDto,
      required: true,
    }),
    ApiNoContentResponse({
      description:
        "Even if current email is not registered (for prevent user's email detection)",
    }),
    ApiBadRequestResponse({
      description:
        'If the inputModel has incorrect values (in particular if the user with' +
        ' the given email or password already exists)',
      type: ErrorResponse,
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
        'If the inputModel has incorrect values (in particular if the user with' +
        ' the given email or password already exists)',
      type: ErrorResponse,
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
    ApiBearerAuth(),
    ApiOkResponse({
      description:
        'Returns JWT accessToken (expired after 10 seconds) in body and JWT' +
        ' refreshToken in cookie (http-only, secure) (expired after 20 seconds).',
      type: TokenResponse,
    }),
    ApiUnauthorizedResponse({
      description:
        'If the JWT refreshToken inside cookie is missing, expired or incorrect',
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
