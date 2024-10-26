import {
  createHandler,
  getStripeProductPricesList,
  initStripeClient,
  processProductPrices,
} from '../netlify.helpers';

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

  const stripe = initStripeClient();

  const prices = await getStripeProductPricesList(stripe, productId);

  return {
    status: 'ok',
    data: {
      prices: processProductPrices(prices),
    },
  };
});
