import { HttpException, ValidationError, ValidationPipe } from '@nestjs/common';
// import { SourceLocation } from 'graphql';

export class AppException extends HttpException {
  code: string;
  extra?: any;

  constructor(code?: string, message?: string, status?: number, extra?: any) {
    super(message, status);
    this.code = code;
    this.extra = extra;
  }
}
function notFoundError(code: string, message: string, extra?: any) {
  return new AppException(code, message, 404, extra);
}

function businessError(code: string, message: string, extra?: any) {
  return new AppException(code, message, 400, extra);
}

function authError(code: string, message: string, extra?: any) {
  return new AppException(code, message, 401, extra);
}

function fobiddenError(code: string, message: string, extra?: any) {
  return new AppException(code, message, 403, extra);
}

export const ErrorData = {
  Auth: {
    unauthenticated: authError('A000', 'Unauthenticated'),
    user_not_exist: authError('A001', "User ID doesn't exist"),
    password_incorrect: authError('A002', 'Password is incorrect'),
    refresh_token_or_auth_token_is_invalid: authError(
      'A003',
      'Refesh token or auth token is invalid',
    ),
    refresh_token_not_found: authError('A004', 'Refresh token not found'),
    refresh_token_revoked: authError('A012', 'Refresh token revoked'),
    refresh_token_malformed: authError('A013', 'Refresh token malformed'),
    can_not_reset_old_password: authError(
      'A014',
      'New password is the same with old password',
    ),
    wrong_token: authError('A016', 'Wrong token'),
    api_key_incorrect: authError('A017', 'ApiKey is incorrect'),
    user_verify: authError('A018', 'User is un-verify'),
    user_login_failure: authError('A019', 'login failure.'),
    can_not_gen_token_cause_no_user: authError(
      'A021',
      'can_not_gen_token_cause_no_user',
    ),
    generate_refresh_token_failure: authError(
      'A022',
      'generate refresh token failure',
    ),
    decode_token_failure: authError('A023', 'decode token failure'),
    user_existed: authError('A024', 'User have already existed'),
  },
  Forbidden: {
    permission_denined: (extra?) =>
      fobiddenError('F000', 'permission denied', extra),
  },
  Business: {
    failure: businessError('B000', 'function failure'),
    user_not_exist: businessError('B001', 'User not found'),
    password_incorrect: businessError('B002', 'Password is incorrect'),
    can_not_reset_old_password: businessError(
      'B003',
      'New password is the same with old password',
    ),
    old_password_incorrect: businessError('B004', 'Old password is incorrect'),
    material_not_exist: businessError('B005', 'Material not found'),
    material_type_not_exist: businessError('B006', 'Material Type not found'),
    style_not_exist: businessError('B007', 'Style not found'),
    wrong_id: businessError('B008', 'Wrong id format'),
    query_error: businessError('B009', 'Query error'),
    request_not_exist: businessError('B010', 'Request not found'),
    simulation_not_exist: businessError('B011', 'Simulation not found'),
    componentId_or_componentInput_required: businessError(
      'B012',
      'componentId or componentInput is required',
    ),
    user_not_active: businessError('B012', 'User does not active'),
    accept_image_only: businessError(
      'B013',
      'Only image files are allowed! (jpg|jpeg|png|gif)',
    ),
    can_not_activate_user_due_to_expire: businessError(
      'B014',
      "Can't activate this user due to expire",
    ),
    user_already_active: businessError('B015', 'User already activate'),
    new_password_same_current_password: businessError(
      'B016',
      'New password is the same with current password',
    ),
    reset_password_failture: businessError('B017 ', 'Reset password failture'),
  },
  NotFound: {
    resource_not_found: notFoundError('N000', 'resource not found'),
    id_not_found: notFoundError('N001', 'Invalid ID value'),
    ref_not_found: notFoundError(
      'N002',
      'reference Id or reference type not found',
    ),
  },
  Validate: {
    user_bad_input: (errors?: ValidationError[]) =>
      businessError(
        'V000',
        'User bad input',
        errors?.map((e: ValidationError) => {
          return {
            property: e.property,
            value: e.value,
            constraints: Object.entries(e.constraints || {}).map((e) => {
              return {
                name: e[0],
                message: e[1],
              };
            }),
          };
        }),
      ),
  },
};

export function getMessages() {
  const errorData = ErrorData;
  const errKeys = Object.keys(errorData);
  const errorStringIds = [];
  for (let i = 0; i < errKeys.length; i++) {
    const key = errKeys[i];

    const keys = Object.values(errorData[key]);
    keys.forEach((e) => {
      errorStringIds.push({ id: e['code'], message: e['message'] });
    });
  }
}

export class AppGraphQLFormattedError {
  message: string;
  // locations?: readonly SourceLocation[];
  path?: readonly (string | number)[];
  extensions?: any;
  code: string;
  name: string;

  constructor(err) {
    const { originalError, extensions } = err;

    const uknownError = ErrorData.Business.failure;
    this.code = uknownError.code;
    this.name = uknownError?.name;
    this.message = uknownError?.message;
    this.path = err?.path;

    if (originalError) {
      if (originalError instanceof AppException) {
        this.code = originalError?.code;
        this.extensions = originalError?.extra;
        this.message = originalError?.message;
        this.name = originalError?.name;
        return;
      } else if (originalError.constructor.name === 'Error') {
        const dbError = ErrorData.Business.query_error;
        this.code = dbError?.code;
        this.extensions = originalError?.message;
        this.message = dbError?.message;
        this.name = dbError?.name;
      } else {
        console.log(err);
        this.extensions = { type: originalError.constructor.name };
        this.message = originalError?.name;
        this.name = originalError?.message;
      }
    } else if (extensions) {
      if (extensions?.code === 'UNAUTHENTICATED') {
        const unauthenticatedError = ErrorData.Auth.unauthenticated;
        this.code = unauthenticatedError?.code;
        this.extensions = unauthenticatedError?.extra;
        this.message = unauthenticatedError?.message;
        this.name = unauthenticatedError?.name;
      }
    }
  }
}

export class AppValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) =>
        ErrorData.Validate.user_bad_input(errors),
    });
  }
}
