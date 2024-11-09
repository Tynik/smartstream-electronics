import React, { useState } from 'react';
import { HoneyList } from '@react-hive/honey-layout';

import type { Nullable } from '~/types';
import type { FeatureCategory } from '~/api';
import { Button, Panel } from '~/components';
import { CategoryListItem } from './components';
import { AddCategoryDialog } from './dialogs';
import { useCategories } from '~/hooks';

export const CategoriesPage = () => {
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
        $gap={1}
        loadingContent="Loading..."
        noContent="No categories"
      >
        {category => <CategoryListItem category={category} onEdit={setEditCategory} />}
      </HoneyList>

      <AddCategoryDialog
        isOpen={isAddCategory}
        onClose={() => setIsAddCategory(false)}
        onSuccess={() => {
          setIsAddCategory(false);

          return refetchCategories();
        }}
      />
    </Panel>
  );
};
