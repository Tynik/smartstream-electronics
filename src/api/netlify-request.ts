import type { HTTPRequestMethod } from '~/types';

export type NetlifyFunction = 'get-product' | 'get-products';

export type NetlifyRequestResponse<Response> = {
  status: string;
  data: Response;
};

type NetlifyRequestOptions<Payload> = {
  payload?: Payload;
  method?: HTTPRequestMethod;
  params?: Record<string, string | number>;
};

export const netlifyRequest = async <Response, Payload = unknown>(
  funcName: NetlifyFunction,
  { payload, method = 'GET', params = {} }: NetlifyRequestOptions<Payload> = {},
): Promise<NetlifyRequestResponse<Response>> => {
  let body: BodyInit | null = null;

  if (payload instanceof FormData) {
    body = payload;
    //
  } else if (payload) {
    body = JSON.stringify(payload);
  }

  const queryParams = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
      acc[key] = String(value);

      return acc;
    }, {}),
  ).toString();

  const response = await fetch(
    `${process.env.NETLIFY_SERVER || ''}/.netlify/functions/${funcName}?${queryParams}`,
    {
      method,
      body,
      credentials: 'include',
    },
  );

  if (!response.ok) {
    return Promise.reject(await response.json());
  }

  return (await response.json()) as NetlifyRequestResponse<Response>;
};
