import { createHandler } from '../netlify.helpers';
import { verifyAuthToken } from '../netlify-auth.helpers';

type VerifyTokenPayload = {
  token: string;
};

export const handler = createHandler<VerifyTokenPayload>(
  { allowMethods: ['POST'] },
  async ({ payload }) => {
    if (!payload) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'Payload is empty',
        },
      };
    }

    try {
      verifyAuthToken(payload.token);

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
