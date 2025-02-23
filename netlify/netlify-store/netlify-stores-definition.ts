import { getStorage } from 'firebase-admin/storage';

import type {
  ApplicationRecord,
  CategoryRecord,
  DatasheetRecord,
  FeatureCategoryRecord,
  FeatureRecord,
  FileRecord,
  ManufacturerRecord,
  MeasurementRecord,
  OrderProductRecord,
  OrderRecord,
  ProductFeatureRecord,
  ProductFileRecord,
  ProductRecord,
  BillingAddressRecord,
  UserRecord,
  ShippingAddressRecord,
} from '../netlify.types';
import { FIREBASE_BUCKET_NAME } from '../netlify.constants';
import { initFirebaseApp } from '../netlify-firebase.helpers';
import { defineNetlifyStores } from './netlify-store';

type NetlifyStores = {
  users: UserRecord;
  userShippingAddresses: ShippingAddressRecord;
  userBillingAddresses: BillingAddressRecord;
  files: FileRecord;
  measurements: MeasurementRecord;
  manufacturers: ManufacturerRecord;
  applications: ApplicationRecord;
  datasheets: DatasheetRecord;
  categories: CategoryRecord;
  featureCategories: FeatureCategoryRecord;
  features: FeatureRecord;
  products: ProductRecord;
  productFiles: ProductFileRecord;
  productFeatures: ProductFeatureRecord;
  orders: OrderRecord;
  orderProducts: OrderProductRecord;
};

initFirebaseApp();

export const netlifyStores = defineNetlifyStores<NetlifyStores>({
  users: {
    //
  },
  userShippingAddresses: {
    constraints: [
      {
        type: 'foreignKey',
        field: 'userId',
        store: 'users',
      },
    ],
  },
  userBillingAddresses: {
    constraints: [
      {
        type: 'foreignKey',
        field: 'userId',
        store: 'users',
      },
    ],
  },
  files: {
    onAfterDelete: async fileRecord => {
      const bucket = getStorage().bucket(FIREBASE_BUCKET_NAME);

      const file = bucket.file(fileRecord.path);
      await file.delete();
    },
  },
  measurements: {
    //
  },
  manufacturers: {
    //
  },
  applications: {
    //
  },
  datasheets: {
    constraints: [
      {
        type: 'foreignKey',
        field: 'fileId',
        store: 'files',
      },
      {
        type: 'foreignKey',
        field: 'manufacturerId',
        store: 'manufacturers',
        isAllowEmpty: true,
      },
    ],
  },
  categories: {
    constraints: [
      {
        type: 'unique',
        fields: ['name'],
      },
    ],
  },
  featureCategories: {
    constraints: [
      {
        type: 'unique',
        fields: ['name'],
      },
    ],
  },
  features: {
    constraints: [
      {
        type: 'foreignKey',
        field: 'categoryId',
        store: 'featureCategories',
      },
      {
        type: 'foreignKey',
        field: 'measurementId',
        store: 'measurements',
      },
      {
        type: 'unique',
        fields: ['categoryId', 'name'],
      },
    ],
  },
  products: {
    constraints: [
      {
        type: 'foreignKey',
        field: 'categoryId',
        store: 'categories',
      },
    ],
  },
  productFiles: {
    constraints: [
      {
        type: 'foreignKey',
        field: 'categoryId',
        store: 'categories',
      },
      {
        type: 'foreignKey',
        field: ['categoryId', 'productId'],
        store: 'products',
      },
      {
        type: 'foreignKey',
        field: 'fileId',
        store: 'files',
      },
    ],
  },
  productFeatures: {
    constraints: [
      {
        type: 'foreignKey',
        field: ['categoryId', 'productId'],
        store: 'products',
      },
      {
        type: 'foreignKey',
        field: 'featureId',
        store: 'features',
      },
    ],
  },
  orders: {
    constraints: [
      {
        type: 'foreignKey',
        field: 'userId',
        store: 'users',
      },
    ],
  },
  orderProducts: {
    constraints: [
      {
        type: 'foreignKey',
        field: ['userId', 'orderId'],
        store: 'orders',
      },
      {
        type: 'foreignKey',
        field: ['categoryId', 'productId'],
        store: 'products',
      },
    ],
  },
});
