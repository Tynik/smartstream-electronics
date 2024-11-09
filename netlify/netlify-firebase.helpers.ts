import type { ServiceAccount } from 'firebase-admin/app';
import { initializeApp, cert } from 'firebase-admin/app';

import { FIREBASE_SERVICE_ACCOUNT } from './netlify.constants';
import { assert } from './netlify.helpers';

export const initFirebaseApp = () => {
  assert(
    FIREBASE_SERVICE_ACCOUNT,
    'The `FIREBASE_SERVICE_ACCOUNT` must be set as environment variable',
  );

  const serviceAccountJson = Buffer.from(FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf8');
  const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;

  return initializeApp({
    credential: cert(serviceAccount),
  });
};
