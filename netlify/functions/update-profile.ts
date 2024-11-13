import { createHandler } from '../netlify.helpers';
import { withCredentials } from '../netlify-auth.helpers';
import { netlifyStores } from '../netlify-store';

type UpdateProfilePayload = {
  firstName: string;
  lastName: string;
  phone: string;
};

export const handler = createHandler<UpdateProfilePayload>(
  { allowMethods: ['PATCH'] },
  withCredentials(async ({ payload, userRecord }) => {
    if (!payload) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'Payload is empty',
        },
      };
    }

    await netlifyStores.users.update(userRecord.email, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
    });

    return {
      status: 'ok',
      data: {},
    };
  }),
);
