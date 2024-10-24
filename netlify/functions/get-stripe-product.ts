import {
  createHandler,
  getStripeProductPricesList,
  initStripeClient,
  processProductPrices,
} from '../helpers';

export const handler = createHandler({ allowMethods: ['GET'] }, async ({ event }) => {
  const productId = event.queryStringParameters?.productId;
  if (!productId) {
    return {
      status: 'error',
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
