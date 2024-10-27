import jwt from 'jsonwebtoken';

import { SECRET_KEY } from './netlify.constants';
import { assert } from './netlify.helpers';

const AUTH_TOKEN_EXPIRATION = '1h';
const SIGN_UP_CONFIRMATION_TOKEN_EXPIRATION = '30m';

type CreateAuthTokenOptions = {
  email: string;
};

export const createAuthToken = ({ email }: CreateAuthTokenOptions) => {
  assert(SECRET_KEY, 'The `SECRET_KEY` must be set as environment variable');

  return jwt.sign({ email }, SECRET_KEY, {
    expiresIn: AUTH_TOKEN_EXPIRATION,
  });
};

type CreateSignUpConfirmationTokenOptions = {
  lastName: string;
  firstName: string;
  email: string;
};

export const createSignUpConfirmationToken = ({
  firstName,
  lastName,
  email,
}: CreateSignUpConfirmationTokenOptions) => {
  assert(SECRET_KEY, 'The `SECRET_KEY` must be set as environment variable');

  return jwt.sign({ firstName, lastName, email }, SECRET_KEY, {
    expiresIn: SIGN_UP_CONFIRMATION_TOKEN_EXPIRATION,
  });
};

export const verifyToken = (token: string) => {
  assert(SECRET_KEY, 'The `SECRET_KEY` must be set as environment variable');

  return jwt.verify(token, SECRET_KEY);
};
