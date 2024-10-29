import { v4 as uuidv4 } from 'uuid';

import type { FeatureCategoryRecord } from '../netlify.types';
import { createHandler } from '../netlify.helpers';
import { getNetlifyStore } from '../netlify-store.helpers';
import { createHexHash } from '../netlify-crypto.helpers';

type AddFeatureCategoryPayload = {
  name: string;
};

export const handler = createHandler<AddFeatureCategoryPayload>(
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

    const featureCategoryNamesStore = getNetlifyStore({
      name: 'feature-category-names',
    });

    const hashedFeatureCategoryName = createHexHash(payload.name);

    const existingFeatureCategory = await featureCategoryNamesStore.get(hashedFeatureCategoryName);
    if (existingFeatureCategory) {
      return {
        status: 'error',
        statusCode: 409,
        data: {
          error: 'Feature category name already exists',
        },
      };
    }

    const featureCategoriesStore = getNetlifyStore({
      name: 'feature-categories',
    });

    const featureCategoryRecord: FeatureCategoryRecord = {
      id: uuidv4(),
      name: payload.name,
    };

    await featureCategoriesStore.setJSON(featureCategoryRecord.id, featureCategoryRecord);
    await featureCategoryNamesStore.set(hashedFeatureCategoryName, '1');

    return {
      status: 'ok',
      data: {},
    };
  },
);
