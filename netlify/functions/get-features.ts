import { createHandler } from '../netlify.helpers';
import { netlifyStores } from '../netlify-store';

export const handler = createHandler({ allowMethods: ['GET'] }, async ({ event }) => {
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

  const featureRecords = await netlifyStores.features.getList({
    prefix: categoryId,
  });

  return {
    status: 'ok',
    data: featureRecords,
  };
});
