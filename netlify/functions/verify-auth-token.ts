import { createHandler } from '../netlify.helpers';
import { verifyToken } from '../netlify-auth.helpers';

type VerifyTokenPayload = {
  token: string;
};

export const handler = createHandler<VerifyTokenPayload>(
  { allowMethods: ['GET'] },
  async ({ cookies }) => {
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
      verifyToken(cookies.authToken);

      return {
        status: 'ok',
        data: {},
      };
    } catch (e) {
      return {
        status: 'error',
        statusCode: 401,
        data: {
          error: 'Token is invalid',
        },
      };
    }
  },
);
