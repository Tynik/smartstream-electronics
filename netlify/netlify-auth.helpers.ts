import type { AuthTokenPayload, UserRecord, UserRole } from './netlify.types';
import type { CreateHandlerFunction, CreateHandlerFunctionOptions } from './netlify.helpers';
import { NetlifyError } from './netlify-errors';
import { verifyToken } from './netlify-crypto.helpers';
import { NetlifyStoreError, netlifyStores } from './netlify-store';

export const withCredentials = <Payload = unknown>(
  fn: (
    options: CreateHandlerFunctionOptions<Payload> & {
      tokenPayload: AuthTokenPayload;
      userRecord: UserRecord;
    },
  ) => ReturnType<CreateHandlerFunction<Payload>>,
): CreateHandlerFunction<Payload> => {
  return async options => {
    const { cookies } = options;

    if (!cookies.authToken) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'The token is not provided',
        },
      };
    }

    try {
      const tokenPayload = verifyToken<AuthTokenPayload>(cookies.authToken);

      const userRecord = await netlifyStores.users.get(tokenPayload.email);
      if (!userRecord || userRecord.status === 'inactive') {
        return {
          status: 'error',
          statusCode: 400,
          data: {
            error: 'User not found or inactive',
          },
        };
      }

      return await fn({
        ...options,
        tokenPayload,
        userRecord,
      });
    } catch (e) {
      if (e instanceof NetlifyError || e instanceof TypeError) {
        throw e;
      }

      return {
        status: 'error',
        statusCode: 401,
        data: {
          error: 'Token expired',
        },
      };
    }
  };
};

export const assertUserRole = (userRecord: UserRecord, role: UserRole) => {
  if (userRecord.role !== role) {
    throw new NetlifyStoreError({
      status: 'error',
      statusCode: 401,
      data: {
        error: 'You are not allowed to make this action',
      },
    });
  }
};
