import React, { useState } from 'react';
import { HoneyList } from '@react-hive/honey-layout';

import type { Nullable } from '~/types';
import type { FeatureCategory } from '~/api';
import { Button, Loading, Panel } from '~/components';
import { CategoryListItem } from './components';
import { AddCategoryDialog } from './dialogs';
import { useCategories } from '~/hooks';

export const ManageCategoriesPage = () => {
  const [isAddCategory, setIsAddCategory] = useState(false);
  const [editCategory, setEditCategory] = useState<Nullable<FeatureCategory>>(null);

  const { categories, isCategoriesLoading, isCategoriesError, refetchCategories } = useCategories();

  return (
    <Panel title="Categories">
      <Button onClick={() => setIsAddCategory(true)} $marginLeft="auto">
        Add Category
      </Button>

      <HoneyList
        items={categories}
        isLoading={isCategoriesLoading}
        isError={isCategoriesError}
        itemKey="id"
        loadingContent={<Loading $margin="auto" />}
        noContent="No categories"
        $gap={1}
        $minHeight="250px"
      >
        {category => <CategoryListItem category={category} onEdit={setEditCategory} />}
      </HoneyList>

      <AddCategoryDialog
        isOpen={isAddCategory}
        onClose={() => setIsAddCategory(false)}
        onSuccess={refetchCategories}
      />
    </Panel>
  );
};
