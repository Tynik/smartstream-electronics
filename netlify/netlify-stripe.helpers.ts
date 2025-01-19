import Stripe from 'stripe';

import { STRIPE_API_KEY } from './netlify.constants';
import { assert } from './netlify.helpers';

export const initStripeClient = (): Stripe => {
  assert(STRIPE_API_KEY, 'The `STRIPE_API_KEY` must be set as environment variable');

  return new Stripe(STRIPE_API_KEY, {
    apiVersion: '2024-12-18.acacia',
  });
};

type StripeShippingRates = {
  minimumWeightThreshold: number;
};

export const getStripeAllowableShippingRates = async (
  stripe: Stripe,
  { minimumWeightThreshold }: StripeShippingRates,
): Promise<Stripe.ShippingRate[]> => {
  const { data: shippingRates } = await stripe.shippingRates.list({
    active: true,
    limit: 100,
  });

  return shippingRates.filter(
    shippingRate =>
      +shippingRate.metadata.minWeight <= minimumWeightThreshold &&
      (!shippingRate.metadata.maxWeight ||
        +shippingRate.metadata.maxWeight >= minimumWeightThreshold),
  );
};

export const getStripeProductsList = async (stripe: Stripe): Promise<Stripe.Product[]> => {
  const { data: products } = await stripe.products.list({
    active: true,
    limit: 100,
  });

  return products;
};

export const getStripeProductPricesList = async (
  stripe: Stripe,
  productId: Stripe.Product['id'],
): Promise<Stripe.Price[]> => {
  const { data: prices } = await stripe.prices.list({
    product: productId,
    active: true,
    limit: 100,
  });

  return prices;
};

export const findStripeCustomer = async (
  stripe: Stripe,
  email: string,
): Promise<Stripe.Customer> => {
  const { data } = await stripe.customers.list({
    email,
    limit: 1,
  });

  return data[0];
};

export type StripeProductPrices = Record<
  Stripe.Price['id'],
  {
    amount: number;
    quantity: number;
  }
>;

export const processProductPrices = (prices: Stripe.Price[]): StripeProductPrices =>
  prices.reduce<StripeProductPrices>((resultPrices, price) => {
    resultPrices[price.id] = {
      amount: price.active ? (price.unit_amount ?? 0) / 100 : 0,
      quantity: +(price.metadata.quantity ?? 0),
    };

    return resultPrices;
  }, {});
