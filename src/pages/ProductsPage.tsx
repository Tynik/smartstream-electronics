import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { MANAGE_ADD_PRODUCT_ROUTE_PATH } from '~/constants';
import { getProducts } from '~/api';
import { Button, Loading, Panel } from '~/components';

export const ProductsPage = () => {
  const navigate = useNavigate();

  const { data: products, isInitialLoading: isProductsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts({ page: 1, pageSize: 25 }),
  });

  if (isProductsLoading) {
    return <Loading $margin="auto" />;
  }

  return (
    <Panel title="Products">
      <Button onClick={() => navigate(MANAGE_ADD_PRODUCT_ROUTE_PATH)} $marginLeft="auto">
        Add Product
      </Button>

      {products?.map(product => <div key={product.id} />)}
    </Panel>
  );
};
