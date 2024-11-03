import type { FeatureCategoryId } from '../netlify.types';
import { createHandler } from '../netlify.helpers';
import { getNetlifyStore } from '../netlify-store.helpers';
import { createHexHash } from '../netlify-crypto.helpers';
import { withCredentials } from '../netlify-auth.helpers';
import { netlifyStores } from '../netlify-store';

type UpdateFeatureCategoryPayload = {
  id: FeatureCategoryId;
  name: string;
};

export const handler = createHandler<UpdateFeatureCategoryPayload>(
  { allowMethods: ['PATCH'] },
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

    const featureCategoryNamesStore = getNetlifyStore({
      name: 'feature-category-names',
    });

    const newHashedFeatureCategoryName = createHexHash(payload.name);

    const existingFeatureCategory = await featureCategoryNamesStore.get(
      newHashedFeatureCategoryName,
    );

    if (existingFeatureCategory) {
      return {
        status: 'error',
        statusCode: 409,
        data: {
          error: 'Feature category name already exists',
        },
      };
    }

    const featureCategoryRecord = await netlifyStores.featureCategories.get(payload.id);
    if (!featureCategoryRecord) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'Feature category not found',
        },
      };
    }

    const prevHashedFeatureCategoryName = createHexHash(featureCategoryRecord.name);

    await Promise.all([
      netlifyStores.featureCategories.setJSON(featureCategoryRecord.id, {
        ...featureCategoryRecord,
        name: payload.name,
      }),
      featureCategoryNamesStore.delete(prevHashedFeatureCategoryName),
      featureCategoryNamesStore.set(newHashedFeatureCategoryName, '1'),
    ]);

    return {
      status: 'ok',
      data: {},
    };
  }),
);
