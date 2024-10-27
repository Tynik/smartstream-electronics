export const SITE_DOMAIN = process.env.SITE_DOMAIN || 'http://localhost:8097';
export const IS_LOCAL_ENV = process.env.NETLIFY_LOCAL === 'true';

export const { URL, SITE_ID, NETLIFY_TOKEN, SECRET_KEY, STRIPE_API_KEY, NETLIFY_EMAILS_SECRET } =
  process.env;
