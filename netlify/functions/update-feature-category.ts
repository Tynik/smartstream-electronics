import type { FeatureCategoryId } from '../netlify.types';
import { createHandler } from '../netlify.helpers';
import { assertUserRole, withCredentials } from '../netlify-auth.helpers';
import { netlifyStores } from '../netlify-store';

type UpdateFeatureCategoryPayload = {
  id: FeatureCategoryId;
  name: string;
};

export const handler = createHandler<UpdateFeatureCategoryPayload>(
  { allowMethods: ['PATCH'] },
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

    await netlifyStores.featureCategories.update(payload.id, {
      name: payload.name,
    });

    return {
      status: 'ok',
      data: {},
    };
  }),
);
