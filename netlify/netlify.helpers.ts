import Stripe from 'stripe';
import type { Handler, HandlerResponse, HandlerEvent, HandlerContext } from '@netlify/functions';
import type { GetStoreOptions, Store, ListOptions } from '@netlify/blobs';
import { getStore } from '@netlify/blobs';
import crypto from 'crypto';

import type { Nullable } from './netlify.types';
import { SECRET_KEY, SITE_DOMAIN, STRIPE_API_KEY } from './netlify.constants';

type HTTPMethod = 'POST' | 'GET' | 'OPTIONS' | 'PUT' | 'PATCH' | 'DELETE';

export function assert(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export const hashPassword = (password: string): string => {
  assert(SECRET_KEY, 'The `SECRET_KEY` must be set as environment variable');

  return crypto.createHmac('sha256', SECRET_KEY).update(password).digest('hex');
};

export const initStripeClient = (): Stripe => {
  assert(STRIPE_API_KEY, 'The `STRIPE_API_KEY` must be set as environment variable');

  return new Stripe(STRIPE_API_KEY, {
    apiVersion: '2024-09-30.acacia',
  });
};

type CookieOptions = {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: Date;
  maxAge?: number;
  secure?: boolean;
  partitioned?: boolean;
  httpOnly?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
};

type CreateResponseOptions = {
  statusCode?: number;
  allowMethods?: HTTPMethod[] | null;
  headers?: Record<string, string>;
  cookies?: CookieOptions[];
};

const createResponse = <Data>(
  data: Data,
  { statusCode = 200, allowMethods = null, headers = {}, cookies = [] }: CreateResponseOptions = {},
): HandlerResponse => {
  const formatCookie = ({
    name,
    domain,
    value,
    path = '/',
    expires,
    maxAge,
    secure,
    partitioned,
    httpOnly = true,
    sameSite,
  }: CookieOptions) => {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (path) {
      cookie += `; Path=${path}`;
    }

    if (domain) {
      cookie += `; Domain=${domain}`;
    }

    if (expires) {
      cookie += `; Expires=${expires.toUTCString()}`;
    }

    if (maxAge !== undefined) {
      cookie += `; Max-Age=${maxAge}`;
    }

    if (partitioned) {
      cookie += '; Partitioned';
    }

    if (httpOnly) {
      cookie += '; HttpOnly';
    }

    if (sameSite) {
      cookie += `; SameSite=${sameSite}`;
    }

    if (secure || sameSite === 'None') {
      cookie += '; Secure';
    }

    return cookie;
  };

  const setCookieHeaders = cookies.map(formatCookie);

  return {
    statusCode,
    body: JSON.stringify(data),
    headers: {
      'Access-Control-Allow-Origin': SITE_DOMAIN,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': allowMethods?.join(', ') ?? '*',
      ...headers,
      ...(setCookieHeaders.length ? { 'Set-Cookie': setCookieHeaders as unknown as string } : {}),
    },
  };
};

type CreateHandlerFunctionOptions<Payload = unknown> = {
  event: HandlerEvent;
  context: HandlerContext;
  payload: Payload | null;
};

type CreateHandlerOptions = {
  allowMethods?: HTTPMethod[];
} | null;

type CreateHandlerFunction<Payload, Response = unknown> = (
  options: CreateHandlerFunctionOptions<Payload>,
) => Promise<
  Nullable<{
    data?: Response;
    status: 'ok' | 'error';
    statusCode?: number;
    headers?: Record<string, string>;
    cookies?: CookieOptions[];
  }>
>;

export const createHandler = <Payload = unknown>(
  options: CreateHandlerOptions,
  fn: CreateHandlerFunction<Payload>,
): Handler => {
  return async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(
        { message: 'Successful preflight call.' },
        { allowMethods: options?.allowMethods },
      );
    }

    if (options?.allowMethods && !options.allowMethods.includes(event.httpMethod as HTTPMethod)) {
      return createResponse(`You cannot use HTTP method "${event.httpMethod}" for this endpoint`, {
        statusCode: 400,
        allowMethods: options.allowMethods,
      });
    }

    try {
      const payload =
        event.body && !event.isBase64Encoded ? (JSON.parse(event.body) as Payload) : null;

      const { statusCode, headers, cookies, ...result } =
        (await fn({ event, context, payload })) || {};

      return createResponse(result, {
        statusCode,
        headers,
        cookies,
        allowMethods: options?.allowMethods,
      });
    } catch (e) {
      console.error(e);

      return createResponse(
        { status: 'error' },
        {
          statusCode: 500,
          allowMethods: options?.allowMethods,
        },
      );
    }
  };
};

export const getNetlifyStore = (options: Omit<GetStoreOptions, 'siteID' | 'token'>): Store =>
  getStore({
    ...options,
    siteID: process.env.SITE_ID,
    token: process.env.NETLIFY_TOKEN,
    consistency: 'eventual',
  });

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

type GetNetlifyStoreRecordsOptions = {
  offset?: number;
  limit?: number;
};

export const getNetlifyStoreRecordsByKeys = async <T>(store: Store, keys: string[]) =>
  (await Promise.all(
    keys.map(key => store.get(key, { type: 'json', consistency: 'eventual' })),
  )) as T[];

export const getNetlifyStoreRecords = async <T>(
  store: Store,
  listOptions: Omit<ListOptions, 'paginate'>,
  { offset = 0, limit = 1000 }: GetNetlifyStoreRecordsOptions = {},
) => {
  const listResult = await store.list(listOptions);
  const keys = listResult.blobs.slice(offset, offset + limit).map(blob => blob.key);

  return getNetlifyStoreRecordsByKeys<T>(store, keys);
};
