import { createHandler } from '../netlify.helpers';
import { assertUserRole, withCredentials } from '../netlify-auth.helpers';
import { netlifyStores } from '../netlify-store';

export const handler = createHandler(
  { allowMethods: ['DELETE'] },
  withCredentials(async ({ event, userRecord }) => {
    assertUserRole(userRecord, 'admin');

    const categoryId = event.queryStringParameters?.categoryId;
    if (!categoryId) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'Category ID is missed',
        },
      };
    }

    await netlifyStores.categories.delete(categoryId);

    return {
      status: 'ok',
      data: {},
    };
  }),
);
