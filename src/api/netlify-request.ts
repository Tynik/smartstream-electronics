import type { HTTPRequestMethod } from '~/types';

export type NetlifyFunction =
  | 'get-profile'
  | 'update-profile'
  | 'add-category'
  | 'get-categories'
  | 'update-category'
  | 'delete-category'
  | 'get-product'
  | 'get-products'
  | 'add-feature-category'
  | 'get-feature-categories'
  | 'update-feature-category'
  | 'delete-feature-category'
  | 'upload-file'
  | 'delete-file'
  | 'get-features'
  | 'add-feature'
  | 'add-product'
  | 'sign-in'
  | 'sign-up'
  | 'verify-auth-token'
  | 'confirm-email';

export type NetlifyRequestResponse<Response = unknown> = {
  status: string;
  data: Response;
};

export type NetlifyRequestErrorResponse = {
  status: string;
  data: {
    error: string;
  };
};

type NetlifyRequestOptions<Payload> = {
  payload?: Payload;
  method?: HTTPRequestMethod;
  params?: Record<string, string | number>;
  request?: RequestInit;
};

export const netlifyRequest = async <Response, Payload = unknown>(
  funcName: NetlifyFunction,
  { payload, method = 'GET', params = {}, request }: NetlifyRequestOptions<Payload> = {},
): Promise<NetlifyRequestResponse<Response>> => {
  let body: BodyInit | null = null;

  const isFormData = payload instanceof FormData;

  if (isFormData) {
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
      headers: isFormData
        ? {}
        : {
            'Content-Type': 'application/json',
          },
      ...request,
    },
  );

  if (!response.ok) {
    return Promise.reject((await response.json()) as NetlifyRequestErrorResponse);
  }

  return (await response.json()) as NetlifyRequestResponse<Response>;
};
