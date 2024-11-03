import { v4 as uuidv4 } from 'uuid';

import type { FeatureCategoryId, FeatureRecord } from '../netlify.types';
import { createHandler } from '../netlify.helpers';
import { withCredentials } from '../netlify-auth.helpers';
import { netlifyStores } from '../netlify-store';

type AddFeaturePayload = {
  categoryId: FeatureCategoryId;
  name: string;
};

export const handler = createHandler<AddFeaturePayload>(
  { allowMethods: ['POST'] },
  withCredentials(async ({ payload }) => {
    if (!payload) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'Payload is empty',
        },
      };
    }

    const featureRecord: FeatureRecord = {
      id: uuidv4(),
      categoryId: payload.categoryId,
      measurementId: '',
      name: payload.name,
    };

    await netlifyStores.features.setJSON(
      `${payload.categoryId}/${featureRecord.id}`,
      featureRecord,
    );

    return {
      status: 'ok',
      data: {},
    };
  }),
);
