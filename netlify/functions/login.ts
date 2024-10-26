import type { Nullable, UserRecord } from '../netlify.types';
import { createHandler, getNetlifyStore, hashPassword } from '../netlify.helpers';
import { createAuthToken } from '../netlify-auth.helpers';

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
      data: {
        token: authToken,
      },
    };
  },
);
