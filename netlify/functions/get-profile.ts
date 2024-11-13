import { createHandler } from '../netlify.helpers';
import { withCredentials } from '../netlify-auth.helpers';
import { netlifyStores } from '../netlify-store';

export const handler = createHandler(
  { allowMethods: ['GET'] },
  withCredentials(async ({ userRecord }) => {
    const shippingAddresses = await netlifyStores.userShippingAddresses.getList();
    const billingAddresses = await netlifyStores.userBillingAddresses.getList();

    return {
      status: 'ok',
      data: {
        shippingAddresses,
        billingAddresses,
        id: userRecord.id,
        firstName: userRecord.firstName,
        lastName: userRecord.lastName,
        email: userRecord.email,
        phone: userRecord.phone,
        role: userRecord.role,
      },
    };
  }),
);
