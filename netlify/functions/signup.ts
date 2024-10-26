import { v4 as uuidv4 } from 'uuid';

import type { UserRecord } from '../netlify.types';
import { createHandler, getNetlifyStore, hashPassword } from '../netlify.helpers';

type SignupPayload = {
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

    const usersStore = getNetlifyStore({
      name: 'users',
    });

    const userRecord: UserRecord = {
      id: uuidv4(),
      stripeCustomerId: null,
      firstName: null,
      lastName: null,
      email: payload.email,
      phone: null,
      password: hashPassword(payload.password),
      status: 'active',
      created: Date.now(),
      updated: null,
    };

    await usersStore.setJSON(payload.email, userRecord);

    return {
      status: 'ok',
      data: {},
    };
  },
);
