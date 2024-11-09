import { v4 as uuidv4 } from 'uuid';

import type { FeatureCategoryRecord } from '../netlify.types';
import { createHandler } from '../netlify.helpers';
import { assertUserRole, withCredentials } from '../netlify-auth.helpers';
import { netlifyStores } from '../netlify-store';

type AddFeatureCategoryPayload = {
  name: string;
};

export const handler = createHandler<AddFeatureCategoryPayload>(
  { allowMethods: ['POST'] },
  withCredentials(async ({ payload, userRecord }) => {
    assertUserRole(userRecord, 'admin');

    if (!payload) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'Payload is empty',
        },
      };
    }

    const featureCategoryRecord: FeatureCategoryRecord = {
      id: uuidv4(),
      name: payload.name,
    };

    await netlifyStores.featureCategories.create(featureCategoryRecord.id, featureCategoryRecord);

    return {
      status: 'ok',
      data: {},
    };
  }),
);
