import { v4 as uuidv4 } from 'uuid';

import type { FeatureCategoryId, FeatureRecord, MeasurementId } from '../netlify.types';
import { createHandler } from '../netlify.helpers';
import { assertUserRole, withCredentials } from '../netlify-auth.helpers';
import { netlifyStores } from '../netlify-store';

type AddFeaturePayload = {
  categoryId: FeatureCategoryId;
  measurementId: MeasurementId;
  name: string;
};

export const handler = createHandler<AddFeaturePayload>(
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

    const featureRecord: FeatureRecord = {
      id: uuidv4(),
      categoryId: payload.categoryId,
      measurementId: payload.measurementId,
      name: payload.name,
    };

    await netlifyStores.features.create(`${payload.categoryId}/${featureRecord.id}`, featureRecord);

    return {
      status: 'ok',
      data: {},
    };
  }),
);
