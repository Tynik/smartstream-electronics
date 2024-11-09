import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { HoneyBox, HoneyList } from '@react-hive/honey-layout';

import { MANAGE_ADD_PRODUCT_ROUTE_PATH } from '~/constants';
import { getProducts } from '~/api';
import { Button, Image, Loading, Panel, Text } from '~/components';

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

      <HoneyList items={products} itemKey="id" $gap={2}>
        {product => (
          <HoneyBox
            $display="flex"
            $gap={2}
            $padding={2}
            $borderRadius="4px"
            $border="1px solid"
            $borderColor="secondary.softGray"
          >
            <HoneyBox $width="120px" $height="120px">
              <Image src={product.files[0]} />
            </HoneyBox>

            <Text variant="subtitle1">{product.title}</Text>
          </HoneyBox>
        )}
      </HoneyList>
    </Panel>
  );
};
