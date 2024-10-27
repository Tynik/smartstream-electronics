import { createHandler } from '../netlify.helpers';
import { verifyAuthToken } from '../netlify-auth.helpers';

type VerifyTokenPayload = {
  token: string;
};

export const handler = createHandler<VerifyTokenPayload>(
  { allowMethods: ['GET'] },
  async ({ cookies }) => {
    console.log(process.env);

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
      verifyAuthToken(cookies.authToken);

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
