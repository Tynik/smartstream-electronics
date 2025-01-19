import React from 'react';

import type { Category } from '~/api';
import type { SelectProps } from '~/components';
import { Select } from '~/components';
import { useCategories } from '~/hooks';

type SelectCategoryProps = Omit<
  SelectProps<Category>,
  'options' | 'idKey' | 'valueKey' | 'label' | 'onOpen'
> & {
  //
};

export const SelectCategory = (props: SelectCategoryProps) => {
  const { categories, isCategoriesLoading, isCategoriesError } = useCategories();

  return (
    <Select
      options={categories}
      isLoading={isCategoriesLoading}
      isError={isCategoriesError}
      onOpen={() => {}}
      idKey="id"
      valueKey="name"
      label="* Category"
      {...props}
    />
  );
};
