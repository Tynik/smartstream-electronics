import type { BinaryLike } from 'crypto';
import type { JwtPayload, SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import type { Nullable } from './netlify.types';
import { SECRET_KEY } from './netlify.constants';
import { assert } from './netlify.helpers';

export type TokenPayload = Record<string, Nullable<string | number | undefined>>;

export const createToken = <Payload extends TokenPayload>(
  payload: Payload,
  options: SignOptions = {},
) => {
  assert(SECRET_KEY, 'The `SECRET_KEY` must be set as environment variable');

  return jwt.sign(payload, SECRET_KEY, options);
};

export const verifyToken = <Payload extends TokenPayload>(token: string) => {
  assert(SECRET_KEY, 'The `SECRET_KEY` must be set as environment variable');

  return jwt.verify(token, SECRET_KEY) as JwtPayload & Payload;
};

export const hashPassword = (password: string): string => {
  assert(SECRET_KEY, 'The `SECRET_KEY` must be set as environment variable');

  return crypto.createHmac('sha256', SECRET_KEY).update(password).digest('hex');
};

export const createHexHash = (data: BinaryLike): string => {
  return crypto.createHash('sha256').update(data).digest('hex');
};
