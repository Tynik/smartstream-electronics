import type { ListOptions } from '@netlify/blobs';
import { getStorage } from 'firebase-admin/storage';
import type { GetNetlifyStoreRecordsOptions } from './netlify-store.helpers';
import type {
  ApplicationRecord,
  CategoryRecord,
  DatasheetRecord,
  FeatureCategoryRecord,
  FeatureRecord,
  FileRecord,
  ManufacturerRecord,
  MeasurementRecord,
  Nullable,
  ProductFeatureRecord,
  ProductFileRecord,
  ProductRecord,
  UserRecord,
} from '../netlify.types';
import { NetlifyStoreError } from './netlify-store-errors';
import { getNetlifyStore, getNetlifyStoreRecords } from './netlify-store.helpers';
import { camelToDashCase } from '../netlify.utils';
import {
  cleanupStoreRecordConstraints,
  NETLIFY_STORE_CONSTRAINTS_PROCESSORS_MAP,
} from './netlify-store-constraints';
import { initFirebaseApp } from '../netlify-firebase.helpers';
import { FIREBASE_BUCKET_NAME } from '../netlify.constants';

type NullableStringKeys<T> = {
  [K in keyof T]: T[K] extends Nullable<string> ? K : never;
}[keyof T];

export type DashCase<T extends string> = T extends `${infer First}-${infer Rest}`
  ? `${Lowercase<First>}-${DashCase<Rest>}`
  : Lowercase<T>;

export type NetlifyStoreName = string;

export type NetlifyStoreRecord = object;

type NetlifyStoreEnhancedRecordConstraint = {
  type: 'unique';
  key: string;
};

export type NetlifyStoreEnhancedRecord<StoreRecord extends NetlifyStoreRecord> = StoreRecord & {
  __constraints__: NetlifyStoreEnhancedRecordConstraint[];
};

export type NetlifyStoreConstraintType = 'unique' | 'foreignKey';

type RevertConstraintProcessor = () => Promise<void>;

export type NetlifyStoreConstraintProcessor<
  StoresDefinition extends NetlifyStoresDefinition,
  Constraint extends NetlifyStoreConfigConstraint<StoresDefinition, StoreName>,
  StoreName extends keyof StoresDefinition = keyof StoresDefinition,
> = (
  storeName: DashCase<NetlifyStoreName>,
  constraint: Constraint,
  record: NetlifyStoreEnhancedRecord<Partial<StoresDefinition[StoreName]>>,
) => Promise<RevertConstraintProcessor>;

export type NetlifyStoreConfigUniqueConstraint<
  StoresDefinition extends NetlifyStoresDefinition,
  StoreName extends keyof StoresDefinition = keyof StoresDefinition,
> = {
  type: 'unique';
  fields: NullableStringKeys<StoresDefinition[StoreName]>[];
};

export type NetlifyStoreConfigForeignKeyConstraint<
  StoresDefinition extends NetlifyStoresDefinition,
  StoreName extends keyof StoresDefinition,
> = {
  type: 'foreignKey';
  field:
    | NullableStringKeys<StoresDefinition[StoreName]>
    | NullableStringKeys<StoresDefinition[StoreName]>[];
  store: Exclude<keyof StoresDefinition, StoreName>;
  /**
   * @default false
   */
  isAllowEmpty?: boolean;
};

type NetlifyStoreConfigConstraint<
  StoresDefinition extends NetlifyStoresDefinition,
  StoreName extends keyof StoresDefinition,
> =
  | NetlifyStoreConfigUniqueConstraint<StoresDefinition, StoreName>
  | NetlifyStoreConfigForeignKeyConstraint<StoresDefinition, StoreName>;

type NetlifyStoreConfig<
  StoresDefinition extends NetlifyStoresDefinition,
  StoreName extends keyof StoresDefinition,
> = {
  constraints?: NetlifyStoreConfigConstraint<StoresDefinition, StoreName>[];
  onAfterDelete?: (
    record: NetlifyStoreEnhancedRecord<StoresDefinition[StoreName]>,
  ) => Promise<void>;
};

export type NetlifyStoresDefinition = Record<NetlifyStoreName, NetlifyStoreRecord>;

type NetlifyStoresConfig<StoresDefinition extends NetlifyStoresDefinition> = {
  [StoreName in keyof StoresDefinition]: NetlifyStoreConfig<StoresDefinition, StoreName>;
};

type NetlifyStoreApi<StoreRecord extends NetlifyStoreRecord> = {
  get: (key: string) => Promise<Nullable<NetlifyStoreEnhancedRecord<StoreRecord>>>;
  create: (key: string, record: StoreRecord) => Promise<NetlifyStoreEnhancedRecord<StoreRecord>>;
  update: (
    key: string,
    record: Partial<StoreRecord>,
  ) => Promise<NetlifyStoreEnhancedRecord<StoreRecord>>;
  delete: (key: string) => Promise<void>;
  getList: (
    listOptions?: Omit<ListOptions, 'paginate'>,
    options?: GetNetlifyStoreRecordsOptions,
  ) => Promise<NetlifyStoreEnhancedRecord<StoreRecord>[]>;
};

type NetlifyStoresApi<StoresDefinition extends NetlifyStoresDefinition> = {
  [StoreName in keyof StoresDefinition]: NetlifyStoreApi<StoresDefinition[StoreName]>;
};

const createStoreApi = <
  StoresDefinition extends NetlifyStoresDefinition,
  StoreName extends keyof StoresDefinition,
>(
  storeName: StoreName,
  storeConfig: NetlifyStoreConfig<StoresDefinition, StoreName>,
): NetlifyStoreApi<StoresDefinition[StoreName]> => {
  const netlifyStoreName = camelToDashCase(String(storeName)) as DashCase<NetlifyStoreName>;

  const store = getNetlifyStore({
    name: netlifyStoreName,
  });

  const executeConstraints = async <Record extends Partial<StoresDefinition[StoreName]>>(
    record: Record,
  ) => {
    const enhancedRecord: NetlifyStoreEnhancedRecord<Record> = {
      ...record,
      __constraints__: [],
    };

    const constraintTasksResult = await Promise.allSettled(
      storeConfig.constraints?.map(async constraint => {
        const constraintProcessor = NETLIFY_STORE_CONSTRAINTS_PROCESSORS_MAP[constraint.type];

        return constraintProcessor(netlifyStoreName, constraint, enhancedRecord);
      }) ?? [],
    );

    const failedConstraintTasks = constraintTasksResult.filter(
      constraintResult => constraintResult.status === 'rejected',
    );

    if (failedConstraintTasks.length) {
      await Promise.allSettled(
        constraintTasksResult.map(taskResult => {
          if (taskResult.status === 'fulfilled') {
            const revertConstraint = taskResult.value;
            // Only revert successful constraints
            return revertConstraint();
          }

          return Promise.resolve();
        }),
      );

      throw failedConstraintTasks[0].reason;
    }

    return enhancedRecord;
  };

  const get = async (key: string) => {
    return (await store.get(key, {
      type: 'json',
    })) as Nullable<NetlifyStoreEnhancedRecord<StoresDefinition[StoreName]>>;
  };

  const create = async (key: string, record: StoresDefinition[StoreName]) => {
    const enhancedRecord = await executeConstraints(record);

    await store.setJSON(key, enhancedRecord);

    return enhancedRecord;
  };

  const update = async (key: string, record: Partial<StoresDefinition[StoreName]>) => {
    const enhancedRecord = await executeConstraints(record);

    const previousRecord = (await store.get(key, {
      type: 'json',
    })) as Nullable<NetlifyStoreEnhancedRecord<StoresDefinition[StoreName]>>;

    if (!previousRecord) {
      throw new NetlifyStoreError({
        status: 'error',
        statusCode: 400,
        data: {
          error: `Record by the key "${key}" does not exist`,
        },
      });
    }

    await cleanupStoreRecordConstraints(previousRecord);

    const nextRecord = {
      ...previousRecord,
      ...enhancedRecord,
      // Merge constraints
      __constraints__: [...previousRecord.__constraints__, ...enhancedRecord.__constraints__],
    };

    await store.setJSON(key, nextRecord);

    return nextRecord;
  };

  const deleteRecord = async (key: string) => {
    const record = (await store.get(key, {
      type: 'json',
    })) as Nullable<NetlifyStoreEnhancedRecord<StoresDefinition[StoreName]>>;

    if (!record) {
      throw new NetlifyStoreError({
        status: 'error',
        statusCode: 400,
        data: {
          error: `Record by the key "${key}" does not exist`,
        },
      });
    }

    await Promise.all([cleanupStoreRecordConstraints(record), store.delete(key)]);

    await storeConfig.onAfterDelete?.(record);
  };

  const getList = (
    listOptions?: Omit<ListOptions, 'paginate'>,
    options?: GetNetlifyStoreRecordsOptions,
  ) =>
    getNetlifyStoreRecords<NetlifyStoreEnhancedRecord<StoresDefinition[StoreName]>>(
      store,
      listOptions,
      options,
    );

  return {
    get,
    create,
    update,
    getList,
    delete: deleteRecord,
  };
};

export const defineNetlifyStores = <StoresDefinition extends NetlifyStoresDefinition>(
  storesConfig: NetlifyStoresConfig<StoresDefinition>,
): NetlifyStoresApi<StoresDefinition> => {
  return Object.keys(storesConfig).reduce<NetlifyStoresApi<StoresDefinition>>(
    (storesApi, storeNameKey) => {
      const storeName = storeNameKey as keyof StoresDefinition;

      storesApi[storeName] = createStoreApi(storeName, storesConfig[storeName]);

      return storesApi;
    },
    {} as never,
  );
};

type NetlifyStores = {
  users: UserRecord;
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
};

initFirebaseApp();

export const netlifyStores = defineNetlifyStores<NetlifyStores>({
  users: {
    //
  },
  files: {
    onAfterDelete: async fileRecord => {
      const storage = getStorage();
      const bucket = storage.bucket(FIREBASE_BUCKET_NAME);

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
        field: 'productId',
        store: 'products',
      },
      {
        type: 'foreignKey',
        field: 'featureId',
        store: 'features',
      },
    ],
  },
});
