import React from 'react';

import { useQuery } from '@tanstack/react-query';
import { AppProvider } from '~/providers';
import { TopBar } from '~/components';
import { netlifyRequest } from '~/api';

export const App = () => {
  const { data } = useQuery({
    queryKey: ['product', 'test'],
    queryFn: () =>
      netlifyRequest('get-products', {
        params: {
          categoryId: '21f05fe5-72f6-420b-8e4e-dde6a3f2e9e7',
          page: 1,
          pageSize: 25,
        },
      }),
  });

  console.log(data);

  return (
    <AppProvider>
      <TopBar />
    </AppProvider>
  );
};
