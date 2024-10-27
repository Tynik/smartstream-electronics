import { createHandler } from '../netlify.helpers';
import { withCredentials } from '../netlify-auth.helpers';

type VerifyTokenPayload = {
  token: string;
};

export const handler = createHandler<VerifyTokenPayload>(
  { allowMethods: ['GET'] },
  withCredentials(async () => {
    return {
      status: 'ok',
      data: {},
    };
  }),
);
