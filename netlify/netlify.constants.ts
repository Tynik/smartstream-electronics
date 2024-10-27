export const SITE_DOMAIN = process.env.SITE_DOMAIN || 'http://localhost:8097';
export const IS_LOCAL_ENV = process.env.NETLIFY_LOCAL === 'true';

export const AUTH_TOKEN_EXPIRATION = '1h';
export const EMAIL_CONFIRMATION_TOKEN_EXPIRATION = '30m';

export const { URL, SITE_ID, NETLIFY_TOKEN, SECRET_KEY, STRIPE_API_KEY, NETLIFY_EMAILS_SECRET } =
  process.env;
