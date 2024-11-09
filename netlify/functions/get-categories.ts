import { createHandler } from '../netlify.helpers';
import { netlifyStores } from '../netlify-store';

export const handler = createHandler({ allowMethods: ['GET'] }, async () => {
  const categoriesRecords = await netlifyStores.categories.getList();

  return {
    status: 'ok',
    data: categoriesRecords,
  };
});
