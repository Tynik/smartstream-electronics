import type { ListOptions } from '@netlify/blobs';
import type { GetNetlifyStoreRecordsOptions } from '../netlify-store.helpers';
import type {
  FeatureCategoryRecord,
  FeatureRecord,
  Nullable,
  ProductRecord,
  UserRecord,
} from '../netlify.types';
import { NetlifyStoreConstraintError } from './netlify-store-errors';
import { getNetlifyStore, getNetlifyStoreRecords } from '../netlify-store.helpers';
import { camelToDashCase } from '../netlify.utils';
import { createHexHash } from '../netlify-crypto.helpers';

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type NetlifyStoreName = string;

type NetlifyStoreRecord = object;

type NetlifyStoreConstraintType = 'unique' | 'foreignKey';

type NetlifyStoreConfigUniqueConstraint<
  StoresDefinition extends NetlifyStoresDefinition,
  StoreName extends keyof StoresDefinition,
> = {
  type: 'unique';
  fields: StringKeys<StoresDefinition[StoreName]>[];
};

type NetlifyStoreConfigForeignKeyConstraint<
  StoresDefinition extends NetlifyStoresDefinition,
  StoreName extends keyof StoresDefinition,
> = {
  type: 'foreignKey';
  field: StringKeys<StoresDefinition[StoreName]>;
  store: Exclude<keyof StoresDefinition, StoreName>;
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
};

type NetlifyStoresDefinition = Record<NetlifyStoreName, NetlifyStoreRecord>;

type NetlifyStoresConfig<StoresDefinition extends NetlifyStoresDefinition> = {
  [StoreName in keyof StoresDefinition]: NetlifyStoreConfig<StoresDefinition, StoreName>;
};

type NetlifyStoreApi<StoreRecord extends NetlifyStoreRecord> = {
  get: (key: string) => Promise<Nullable<StoreRecord>>;

  setJSON: (key: string, record: StoreRecord) => Promise<void>;

  getRecords: (
    listOptions?: Omit<ListOptions, 'paginate'>,
    options?: GetNetlifyStoreRecordsOptions,
  ) => Promise<StoreRecord[]>;
};

type NetlifyStoresApi<StoresDefinition extends NetlifyStoresDefinition> = {
  [StoreName in keyof StoresDefinition]: NetlifyStoreApi<StoresDefinition[StoreName]>;
};

type RevertConstraintProcessor = () => Promise<void>;

type ConstraintProcessor<
  StoresDefinition extends NetlifyStoresDefinition,
  Constraint extends NetlifyStoreConfigConstraint<StoresDefinition, StoreName>,
  StoreName extends keyof StoresDefinition = keyof StoresDefinition,
> = (
  storeName: NetlifyStoreName,
  constraint: Constraint,
  record: StoresDefinition[StoreName],
) => Promise<RevertConstraintProcessor>;

const uniqueConstraintProcessor: ConstraintProcessor<
  NetlifyStoresDefinition,
  NetlifyStoreConfigUniqueConstraint<NetlifyStoresDefinition, NetlifyStoreName>
> = async (storeName, constraint, record) => {
  const uniqueConstraintStore = getNetlifyStore({
    name: `${storeName}-${constraint.fields.join('-')}-unique-constraint`,
  });

  const hashedFieldValue = createHexHash(
    constraint.fields.map(fieldName => record[fieldName]).join('-'),
  );

  const existingFeatureCategory = await uniqueConstraintStore.get(hashedFieldValue);
  if (existingFeatureCategory) {
    throw new NetlifyStoreConstraintError({
      status: 'error',
      statusCode: 409,
      data: {
        error: 'Record already exists',
      },
    });
  }

  await uniqueConstraintStore.set(hashedFieldValue, '1');

  return async () => {
    await uniqueConstraintStore.delete(hashedFieldValue);
  };
};

const foreignKeyConstraintProcessor: ConstraintProcessor<
  NetlifyStoresDefinition,
  NetlifyStoreConfigForeignKeyConstraint<NetlifyStoresDefinition, NetlifyStoreName>
> = async (storeName, constraint, record) => {
  const foreignStore = getNetlifyStore({
    name: camelToDashCase(constraint.store),
  });

  const foreignRecord = await foreignStore.get(record[constraint.field]);
  if (!foreignRecord) {
    throw new NetlifyStoreConstraintError({
      status: 'error',
      statusCode: 409,
      data: {
        error: 'Foreign record does not exist',
      },
    });
  }

  return async () => {
    //
  };
};

const NETLIFY_STORE_CONSTRAINTS_PROCESSORS_MAP: Record<
  NetlifyStoreConstraintType,
  ConstraintProcessor<NetlifyStoresDefinition, any>
> = {
  unique: uniqueConstraintProcessor,
  foreignKey: foreignKeyConstraintProcessor,
};

const createStoreApi = <
  StoresDefinition extends NetlifyStoresDefinition,
  StoreRecord extends NetlifyStoreRecord,
  StoreName extends keyof StoresDefinition,
>(
  storeName: StoreName,
  storeConfig: NetlifyStoreConfig<StoresDefinition, StoreName>,
): NetlifyStoreApi<StoreRecord> => {
  const netlifyStoreName = camelToDashCase(String(storeName));

  const store = getNetlifyStore({
    name: netlifyStoreName,
  });

  const get = async (key: string) => {
    return (await store.get(key, {
      type: 'json',
    })) as Nullable<StoreRecord>;
  };

  const setJSON = async (key: string, record: StoreRecord) => {
    const constraintTasksResult = await Promise.allSettled(
      storeConfig.constraints?.map(async constraint => {
        const constraintProcessor = NETLIFY_STORE_CONSTRAINTS_PROCESSORS_MAP[constraint.type];

        return constraintProcessor(netlifyStoreName, constraint, record);
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

    return store.setJSON(key, record);
  };

  const getRecords = <T>(
    listOptions?: Omit<ListOptions, 'paginate'>,
    options?: GetNetlifyStoreRecordsOptions,
  ) => getNetlifyStoreRecords<T>(store, listOptions, options);

  return {
    get,
    setJSON,
    getRecords,
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
  featureCategories: FeatureCategoryRecord;
  features: FeatureRecord;
  products: ProductRecord;
};

export const netlifyStores = defineNetlifyStores<NetlifyStores>({
  users: {
    //
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
        type: 'unique',
        fields: ['categoryId', 'name'],
      },
    ],
  },
  products: {
    //
  },
});
