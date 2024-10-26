import type { ProductRecord } from '../netlify.types';
import { createHandler, getNetlifyStoreRecords, getNetlifyStore } from '../netlify.helpers';
import { IS_LOCAL_ENV } from '../netlify.constants';

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

  const productsStore = getNetlifyStore({
    name: 'products',
  });

  const productRecords = await getNetlifyStoreRecords<ProductRecord>(
    productsStore,
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
    cookies: [
      {
        name: 'authToken',
        value: 'test',
        maxAge: 3600,
        sameSite: IS_LOCAL_ENV ? 'None' : 'Strict',
        secure: true,
      },
    ],
  };
});
