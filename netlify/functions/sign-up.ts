import { v4 as uuidv4 } from 'uuid';

import type { Nullable, UserRecord } from '../netlify.types';
import { createHandler, hashPassword, sendEmail } from '../netlify.helpers';
import { getNetlifyStore } from '../netlify-store.helpers';

type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const handler = createHandler<SignupPayload>(
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

    if (!payload.firstName || !payload.lastName || !payload.email || !payload.password) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'Invalid data',
        },
      };
    }

    const usersStore = getNetlifyStore({
      name: 'users',
    });

    const existedUserRecord = (await usersStore.get(payload.email, {
      type: 'json',
    })) as Nullable<UserRecord>;

    if (existedUserRecord) {
      if (existedUserRecord.status === 'inactive') {
        return {
          status: 'error',
          statusCode: 400,
          data: {
            error: 'The confirmation link is sent to your email address',
          },
        };
      }

      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'User is already registered with that email address',
        },
      };
    }

    const userRecord: UserRecord = {
      id: uuidv4(),
      stripeCustomerId: null,
      role: 'buyer',
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: null,
      password: hashPassword(payload.password),
      status: 'active',
      created: Date.now(),
      updated: null,
    };

    await usersStore.setJSON(payload.email, userRecord);

    await sendEmail('registered', {
      to: payload.email,
      parameters: {
        name: `${payload.firstName} ${payload.lastName}`,
      },
    });

    return {
      status: 'ok',
      data: {},
    };
  },
);
