import React from 'react';

import type { Category } from '~/api';
import type { SelectProps } from '~/components';
import { useCategories } from '~/hooks';
import { Select } from '~/components';

type SelectCategoryProps = Omit<SelectProps<Category>, 'options' | 'valueKey' | 'label'> & {
  //
};

export const SelectCategory = (props: SelectCategoryProps) => {
  const { categories, isCategoriesLoading, isCategoriesError, refetchCategories } = useCategories();

  return <Select options={categories} valueKey="name" label="Category" {...props} />;
};
