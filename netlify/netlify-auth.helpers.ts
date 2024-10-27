import type { CreateHandlerFunction, CreateHandlerFunctionOptions } from './netlify.helpers';
import { verifyToken } from './netlify-crypto.helpers';
import type { AuthTokenPayload } from './netlify.types';

export const withCredentials = <Payload = unknown>(
  fn: (
    options: CreateHandlerFunctionOptions<Payload> & {
      tokenPayload: AuthTokenPayload;
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

      return await fn({ ...options, tokenPayload });
    } catch (e) {
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
