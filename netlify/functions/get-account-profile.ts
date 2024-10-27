import type { Nullable, UserRecord } from '../netlify.types';
import { createHandler } from '../netlify.helpers';
import { getNetlifyStore } from '../netlify-store.helpers';
import { withCredentials } from '../netlify-auth.helpers';

type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const handler = createHandler<SignupPayload>(
  { allowMethods: ['GET'] },
  withCredentials(async ({ tokenPayload }) => {
    const usersStore = getNetlifyStore({
      name: 'users',
    });

    const userRecord = (await usersStore.get(tokenPayload.email, {
      type: 'json',
    })) as Nullable<UserRecord>;

    if (!userRecord || userRecord.status === 'inactive') {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'User not found or inactive',
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
        role: userRecord.role,
      },
    };
  }),
);
