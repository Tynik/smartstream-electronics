import jwt from 'jsonwebtoken';

import { SECRET_KEY } from './netlify.constants';
import { assert } from './netlify.helpers';

const TOKEN_EXPIRATION = '1h';

type CreateAuthTokenOptions = {
  email: string;
};

export const createAuthToken = ({ email }: CreateAuthTokenOptions) => {
  assert(SECRET_KEY, 'The `SECRET_KEY` must be set as environment variable');

  return jwt.sign({ email }, SECRET_KEY, {
    expiresIn: TOKEN_EXPIRATION,
  });
};

export const verifyAuthToken = (token: string) => {
  assert(SECRET_KEY, 'The `SECRET_KEY` must be set as environment variable');

  return jwt.verify(token, SECRET_KEY);
};
