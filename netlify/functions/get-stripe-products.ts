import Stripe from 'stripe';

import type { StripeProductPrices } from '../netlify.helpers';
import {
  createHandler,
  initStripeClient,
  processProductPrices,
  getStripeProductPricesList,
} from '../netlify.helpers';

export const handler = createHandler({ allowMethods: ['GET'] }, async ({ event }) => {
  const productIds = event.queryStringParameters?.ids?.split(',');
  if (!productIds) {
    return {
      status: 'error',
      statusCode: 400,
      data: {
        error: 'Product IDs are missed',
      },
    };
  }

  const stripe = initStripeClient();

  const products = await stripe.products.list({
    ids: productIds,
    limit: 100,
  });

  const productsPrices: Record<Stripe.Product['id'], StripeProductPrices> = {};

  const getProductsPricesTasks = products.data.map(async product => {
    const prices = await getStripeProductPricesList(stripe, product.id);

    productsPrices[product.id] = processProductPrices(prices);
  });

  await Promise.all(getProductsPricesTasks);

  return {
    status: 'ok',
    data: products.data.map(product => ({
      id: product.id,
      prices: productsPrices[product.id],
    })),
  };
});
