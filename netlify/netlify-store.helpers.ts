import type { GetStoreOptions, ListOptions, Store } from '@netlify/blobs';
import { getStore } from '@netlify/blobs';

import { NETLIFY_TOKEN, SITE_ID } from './netlify.constants';

export const getNetlifyStore = (options: Omit<GetStoreOptions, 'siteID' | 'token'>): Store =>
  getStore({
    ...options,
    siteID: SITE_ID,
    token: NETLIFY_TOKEN,
    consistency: 'eventual',
  });

type GetNetlifyStoreRecordsOptions = {
  offset?: number;
  limit?: number;
};

export const getNetlifyStoreRecordsByKeys = async <T>(store: Store, keys: string[]) =>
  (await Promise.all(
    keys.map(key => store.get(key, { type: 'json', consistency: 'eventual' })),
  )) as T[];

export const getNetlifyStoreRecords = async <T>(
  store: Store,
  listOptions: Omit<ListOptions, 'paginate'>,
  { offset = 0, limit = 1000 }: GetNetlifyStoreRecordsOptions = {},
) => {
  const listResult = await store.list(listOptions);
  const keys = listResult.blobs.slice(offset, offset + limit).map(blob => blob.key);

  return getNetlifyStoreRecordsByKeys<T>(store, keys);
};
