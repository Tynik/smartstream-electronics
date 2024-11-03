import { createHandler } from '../netlify.helpers';
import { netlifyStores } from '../netlify-store';

export const handler = createHandler({ allowMethods: ['GET'] }, async () => {
  const featureCategoriesRecords = await netlifyStores.featureCategories.getRecords();

  return {
    status: 'ok',
    data: featureCategoriesRecords,
  };
});
