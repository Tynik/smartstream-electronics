import { createHandler } from '../netlify.helpers';
import { createToken, hashPassword } from '../netlify-crypto.helpers';
import { AUTH_TOKEN_EXPIRATION, IS_LOCAL_ENV } from '../netlify.constants';
import { netlifyStores } from '../netlify-store';

type SignInPayload = {
  email: string;
  password: string;
};

export const handler = createHandler<SignInPayload>(
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

    const userRecord = await netlifyStores.users.get(payload.email);
    if (!userRecord || userRecord.status === 'inactive') {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'User not found or inactive',
        },
      };
    }

    const hashedInputPassword = hashPassword(payload.password);

    if (userRecord.password !== hashedInputPassword) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'Invalid credentials',
        },
      };
    }

    const authToken = createToken<{ email: string }>(
      { email: payload.email },
      {
        expiresIn: AUTH_TOKEN_EXPIRATION,
      },
    );

    return {
      status: 'ok',
      data: {},
      cookie: {
        name: 'authToken',
        value: authToken,
        maxAge: 3600,
        sameSite: IS_LOCAL_ENV ? 'None' : 'Strict',
        secure: true,
      },
    };
  },
);
