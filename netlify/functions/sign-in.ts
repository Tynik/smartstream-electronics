import type { Nullable, UserRecord } from '../netlify.types';
import { createHandler, hashPassword } from '../netlify.helpers';
import { createAuthToken } from '../netlify-auth.helpers';
import { getNetlifyStore } from '../netlify-store.helpers';
import { IS_LOCAL_ENV } from '../netlify.constants';

type LoginPayload = {
  email: string;
  password: string;
};

export const handler = createHandler<LoginPayload>(
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

    const usersStore = getNetlifyStore({
      name: 'users',
    });

    const userRecord = (await usersStore.get(payload.email, {
      type: 'json',
    })) as Nullable<UserRecord>;

    if (!userRecord) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'User not found',
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

    const authToken = createAuthToken({ email: payload.email });

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
