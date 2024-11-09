import { createHandler } from '../netlify.helpers';
import { assertUserRole, withCredentials } from '../netlify-auth.helpers';
import { netlifyStores } from '../netlify-store';

export const handler = createHandler(
  { allowMethods: ['DELETE'] },
  withCredentials(async ({ event, userRecord }) => {
    assertUserRole(userRecord, 'admin');

    const fileId = event.queryStringParameters?.fileId;
    if (!fileId) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'File ID is missed',
        },
      };
    }

    await netlifyStores.files.delete(fileId);

    return {
      status: 'ok',
      data: {},
    };
  }),
);
