import { createHandler } from '../netlify.helpers';
import { netlifyStores } from '../netlify-store';

export const handler = createHandler({ allowMethods: ['GET'] }, async () => {
  const featureCategoriesRecords = await netlifyStores.featureCategories.getList();

  return {
    status: 'ok',
    data: featureCategoriesRecords,
  };
});
