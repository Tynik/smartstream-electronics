import type { FeatureCategoryRecord } from '../netlify.types';
import { createHandler } from '../netlify.helpers';
import { getNetlifyStore, getNetlifyStoreRecords } from '../netlify-store.helpers';

export const handler = createHandler({ allowMethods: ['GET'] }, async () => {
  const featureCategoriesStore = getNetlifyStore({
    name: 'feature-categories',
  });

  const featureCategoriesRecords =
    await getNetlifyStoreRecords<FeatureCategoryRecord>(featureCategoriesStore);

  return {
    status: 'ok',
    data: featureCategoriesRecords,
  };
});
