import type { Nullable, UserRecord } from '../netlify.types';
import { createHandler } from '../netlify.helpers';
import { getNetlifyStore } from '../netlify-store.helpers';
import { verifyToken } from '../netlify-auth.helpers';

type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const handler = createHandler<SignupPayload>(
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
      const tokenPayload = verifyToken<{ email: string }>(cookies.authToken);

      const usersStore = getNetlifyStore({
        name: 'users',
      });

      const userRecord = (await usersStore.get(tokenPayload.email, {
        type: 'json',
      })) as Nullable<UserRecord>;

      if (!userRecord) {
        return {
          status: 'error',
          statusCode: 400,
          data: {
            error: 'Account profile not found',
          },
        };
      }

      return {
        status: 'ok',
        data: {
          firstName: userRecord.firstName,
          lastName: userRecord.lastName,
          email: userRecord.email,
          phone: userRecord.phone,
        },
      };
    } catch (e) {
      return {
        status: 'error',
        statusCode: 401,
        data: {
          error: 'Token expired',
        },
      };
    }
  },
);
