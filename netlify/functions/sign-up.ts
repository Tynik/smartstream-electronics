import { v4 as uuidv4 } from 'uuid';

import type { ConfirmEmailTokenPayload, Nullable, UserRecord } from '../netlify.types';
import { EMAIL_CONFIRMATION_TOKEN_EXPIRATION, URL } from '../netlify.constants';
import { createHandler, hashPassword, sendEmail } from '../netlify.helpers';
import { getNetlifyStore } from '../netlify-store.helpers';
import { createToken } from '../netlify-crypto.helpers';

type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const handler = createHandler<SignupPayload>(
  { allowMethods: ['POST'] },
  async ({ payload }) => {
    if (!payload) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'Payload is empty',
        },
      };
    }

    if (!payload.firstName || !payload.lastName || !payload.email || !payload.password) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'Invalid data',
        },
      };
    }

    const usersStore = getNetlifyStore({
      name: 'users',
    });

    const existedUserRecord = (await usersStore.get(payload.email, {
      type: 'json',
    })) as Nullable<UserRecord>;

    const sendSignUpConfirmationEmail = () => {
      const token = createToken<ConfirmEmailTokenPayload>(
        {
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          phone: null,
        },
        {
          expiresIn: EMAIL_CONFIRMATION_TOKEN_EXPIRATION,
        },
      );

      return sendEmail('email-confirmation', {
        to: payload.email,
        subject: 'Confirm Your Registration with SmartStream Electronics',
        parameters: {
          name: `${payload.firstName} ${payload.lastName}`,
          siteUrl: URL,
          confirmEmailLink: `${URL}/email/confirm?token=${token}`,
        },
      });
    };

    if (existedUserRecord) {
      if (existedUserRecord.status === 'inactive') {
        await sendSignUpConfirmationEmail();

        return {
          status: 'error',
          statusCode: 400,
          data: {
            errorCode: 1001,
            error: 'The confirmation link is sent to your email address',
          },
        };
      }

      return {
        status: 'error',
        statusCode: 400,
        data: {
          errorCode: 1000,
          error: 'User is already registered with that email address',
        },
      };
    }

    const newUserRecord: UserRecord = {
      id: uuidv4(),
      stripeCustomerId: null,
      role: 'buyer',
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: null,
      password: hashPassword(payload.password),
      status: 'inactive',
      created: Date.now(),
      updated: null,
    };

    await usersStore.setJSON(payload.email, newUserRecord);
    await sendSignUpConfirmationEmail();

    return {
      status: 'ok',
      data: {},
    };
  },
);
