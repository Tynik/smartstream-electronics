import { createHandler } from '../netlify.helpers';
import { withCredentials } from '../netlify-auth.helpers';

type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const handler = createHandler<SignupPayload>(
  { allowMethods: ['GET'] },
  withCredentials(async ({ userRecord }) => {
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
