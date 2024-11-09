import { v4 as uuidv4 } from 'uuid';

import type {
  FeatureCategoryId,
  FileId,
  Nullable,
  ProductFileRecord,
  ProductRecord,
  StripeProductId,
  UploadFileType,
} from '../netlify.types';
import { createHandler } from '../netlify.helpers';
import { assertUserRole, withCredentials } from '../netlify-auth.helpers';
import { netlifyStores } from '../netlify-store';

type ProductFilePayload = {
  fileId: FileId;
  type: UploadFileType;
};

type AddProductPayload = {
  categoryId: FeatureCategoryId;
  stripeProductId: Nullable<StripeProductId>;
  files: ProductFilePayload[];
  title: string;
  subtitle: Nullable<string>;
  content: string;
  totalQuantity: number;
};

export const handler = createHandler<AddProductPayload>(
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

    const productRecord: ProductRecord = {
      id: uuidv4(),
      categoryId: payload.categoryId,
      stripeProductId: payload.stripeProductId,
      title: payload.title,
      subtitle: payload.subtitle,
      content: payload.content,
      totalQuantity: payload.totalQuantity,
      seo: {
        description: '',
        keywords: [],
      },
      applicationIds: [],
    };

    const productRecordKey = `${payload.categoryId}/${productRecord.id}`;

    await netlifyStores.products.create(productRecordKey, productRecord);

    try {
      await Promise.all(
        payload.files.map(file => {
          const productFileRecord: ProductFileRecord = {
            id: uuidv4(),
            categoryId: productRecord.categoryId,
            productId: productRecord.id,
            fileId: file.fileId,
            type: file.type,
          };

          return netlifyStores.productFiles.create(
            `${productRecord.id}/${productFileRecord.id}`,
            productFileRecord,
          );
        }),
      );
    } catch (e) {
      await netlifyStores.products.delete(productRecordKey);
      throw e;
    }

    return {
      status: 'ok',
      data: {},
    };
  }),
);
