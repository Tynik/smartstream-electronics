import { createHandler } from '../netlify.helpers';
import { withCredentials } from '../netlify-auth.helpers';
import { netlifyStores } from '../netlify-store';

type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const handler = createHandler<SignupPayload>(
  { allowMethods: ['GET'] },
  withCredentials(async ({ tokenPayload }) => {
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
