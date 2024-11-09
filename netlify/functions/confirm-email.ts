import type { ConfirmEmailTokenPayload } from '../netlify.types';
import { createHandler } from '../netlify.helpers';
import { verifyToken } from '../netlify-crypto.helpers';
import { netlifyStores } from '../netlify-store';

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

    const userRecord = await netlifyStores.users.get(tokenPayload.email);
    if (!userRecord || userRecord.status === 'active') {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'User not found or already active',
        },
      };
    }

    await netlifyStores.users.create(userRecord.email, { ...userRecord, status: 'active' });

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
