import type { ConfirmEmailTokenPayload, Nullable, UserRecord } from '../netlify.types';
import { createHandler } from '../netlify.helpers';
import { getNetlifyStore } from '../netlify-store.helpers';
import { verifyToken } from '../netlify-crypto.helpers';

export const handler = createHandler({ allowMethods: ['POST'] }, async ({ event }) => {
  const token = event.queryStringParameters?.token;
  if (!token) {
    return {
      status: 'error',
      statusCode: 400,
      data: {
        error: 'Product ID is missed',
      },
    };
  }

  try {
    const tokenPayload = verifyToken<ConfirmEmailTokenPayload>(token);

    const usersStore = getNetlifyStore({
      name: 'users',
    });

    const userRecord = (await usersStore.get(tokenPayload.email, {
      type: 'json',
    })) as Nullable<UserRecord>;

    if (!userRecord || userRecord.status === 'active') {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'User not found or already active',
        },
      };
    }

    await usersStore.setJSON(userRecord.email, { ...userRecord, status: 'active' });

    return {
      status: 'ok',
      data: {},
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
});