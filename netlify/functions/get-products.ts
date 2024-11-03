import { createHandler } from '../netlify.helpers';
import { netlifyStores } from '../netlify-store';

export const handler = createHandler({ allowMethods: ['GET'] }, async ({ event }) => {
  const categoryId = event.queryStringParameters?.categoryId;
  const page = Number(event.queryStringParameters?.page);
  const pageSize = Number(event.queryStringParameters?.pageSize);

  if (Number.isNaN(page) || Number.isNaN(pageSize)) {
    return {
      status: 'error',
      statusCode: 400,
      data: {
        error: 'The `page` or `pageSize` is missed',
      },
    };
  }

  if (page < 1 || pageSize < 1 || pageSize > 100) {
    return {
      status: 'error',
      statusCode: 400,
      data: {
        error: 'The `page` or `pageSize` is invalid',
      },
    };
  }

  const productRecords = await netlifyStores.products.getRecords(
    {
      prefix: categoryId,
    },
    {
      offset: (page - 1) * pageSize,
      limit: pageSize,
    },
  );

  return {
    status: 'ok',
    data: productRecords,
  };
});
