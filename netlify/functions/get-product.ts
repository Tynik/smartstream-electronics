import { createHandler } from '../netlify.helpers';
import { netlifyStores } from '../netlify-store';

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

  const productRecord = await netlifyStores.products.get(productId);
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
