import React from 'react';

import { useCategories } from '~/hooks';

export const SelectCategory = () => {
  const { categories, isCategoriesLoading, isCategoriesError, refetchCategories } = useCategories();

  return <>1</>;
};
