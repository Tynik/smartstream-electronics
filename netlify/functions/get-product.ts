import type { Nullable, ProductRecord } from '../netlify.types';
import { createHandler } from '../netlify.helpers';
import { getNetlifyStore } from '../netlify-store.helpers';

export const handler = createHandler({ allowMethods: ['GET'] }, async ({ event }) => {
  const productId = event.queryStringParameters?.productId;
  if (!productId) {
    return {
      status: 'error',
      statusCode: 400,
      data: {
        error: 'Product ID is missed',
      },
    };
  }

  const productsStore = getNetlifyStore({
    name: 'products',
  });

  const productRecord = (await productsStore.get(productId, {
    type: 'json',
  })) as Nullable<ProductRecord>;

  if (!productRecord) {
    return {
      status: 'error',
      statusCode: 400,
      data: {
        error: 'Product not found',
      },
    };
  }

  return {
    status: 'ok',
    data: productRecord,
  };
});
