import type { Handler, HandlerResponse, HandlerEvent, HandlerContext } from '@netlify/functions';
import crypto from 'crypto';

import type { Nullable } from './netlify.types';
import { URL, NETLIFY_EMAILS_SECRET, SECRET_KEY, SITE_DOMAIN } from './netlify.constants';

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

const formatCookie = ({
  name,
  domain,
  value,
  path = '/',
  expires,
  maxAge,
  secure,
  partitioned,
  httpOnly = false,
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

type CreateResponseOptions = {
  statusCode?: number;
  allowMethods?: HTTPMethod[] | null;
  headers?: Record<string, string>;
  cookie?: CookieOptions;
};

const createResponse = <Data>(
  data: Data,
  { statusCode = 200, allowMethods = null, headers = {}, cookie }: CreateResponseOptions = {},
): HandlerResponse => ({
  statusCode,
  body: JSON.stringify(data),
  headers: {
    'Access-Control-Allow-Origin': SITE_DOMAIN,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': allowMethods?.join(', ') ?? '*',
    ...headers,
    ...(cookie
      ? {
          'Set-Cookie': formatCookie(cookie),
        }
      : {}),
  },
});

type CreateHandlerFunctionOptions<Payload = unknown> = {
  event: HandlerEvent;
  context: HandlerContext;
  cookies: Record<string, string>;
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
    cookie?: CookieOptions;
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
      const cookieHeader = event.headers.cookie || event.headers.Cookie;

      const cookies: Record<string, string> = {};
      if (cookieHeader) {
        cookieHeader.split('; ').forEach(cookie => {
          const [name, value] = cookie.split('=');

          cookies[decodeURIComponent(name.trim())] = decodeURIComponent(value.trim());
        });
      }

      const payload =
        event.body && !event.isBase64Encoded ? (JSON.parse(event.body) as Payload) : null;

      const { statusCode, headers, cookie, ...result } =
        (await fn({ event, context, cookies, payload })) || {};

      return createResponse(result, {
        statusCode,
        headers,
        cookie,
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

type SendEmailOptions = {
  to: string;
  subject: string;
  parameters: Record<string, string | undefined>;
};

export const sendEmail = (
  emailTemplate: 'sign-up-confirmation',
  { subject, to, parameters }: SendEmailOptions,
) => {
  assert(NETLIFY_EMAILS_SECRET, 'The `NETLIFY_EMAILS_SECRET` must be set as environment variable');

  return fetch(`${URL}/.netlify/functions/emails/${emailTemplate}`, {
    method: 'POST',
    headers: {
      'netlify-emails-secret': NETLIFY_EMAILS_SECRET,
    },
    body: JSON.stringify({
      to,
      subject,
      parameters,
      from: 'no-reply@smartstream-electronics.co.uk',
    }),
  });
};
