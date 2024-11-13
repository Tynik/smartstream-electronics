import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HoneyGrid, HoneyGridColumn, HoneyList } from '@react-hive/honey-layout';

import type { Nullable } from '~/types';
import type { FeatureCategory } from '~/api';
import { getFeatures, getFeatureCategories } from '~/api';
import { Button, Loading, Panel } from '~/components';
import {
  AddFeatureDialog,
  ManageFeatureCategoryListItem,
  ManageFeatureListItem,
  AddFeatureCategoryDialog,
  EditFeatureCategoryDialog,
} from '~/pages';

export const ManageFeaturesPage = () => {
  const [isAddFeatureCategory, setIsAddFeatureCategory] = useState(false);
  const [isAddFeature, setIsAddFeature] = useState(false);

  const [selectedFeatureCategory, setSelectedFeatureCategory] =
    useState<Nullable<FeatureCategory>>(null);

  const [editFeatureCategory, setEditFeatureCategory] = useState<Nullable<FeatureCategory>>(null);

  const {
    data: featureCategories,
    isInitialLoading: isFeatureCategoriesLoading,
    isError: isFeatureCategoriesError,
    refetch: refetchFeatureCategories,
  } = useQuery({
    queryKey: ['feature-categories'],
    queryFn: getFeatureCategories,
  });

  const {
    data: features,
    isInitialLoading: isFeaturesLoading,
    isError: isFeaturesError,
    refetch: refetchFeatures,
  } = useQuery({
    queryKey: ['feature', selectedFeatureCategory?.id],
    queryFn: () => getFeatures(selectedFeatureCategory!.id),
    enabled: Boolean(selectedFeatureCategory),
  });

  if (isFeatureCategoriesLoading) {
    return <Loading $margin="auto" />;
  }

  return (
    <Panel title="Features">
      <HoneyGrid columns={2} spacing={2}>
        <HoneyGridColumn
          $gap={2}
          $padding={1}
          $borderRadius="4px"
          $border="1px solid"
          $borderColor="secondary.softGray"
        >
          <Button onClick={() => setIsAddFeatureCategory(true)} $marginLeft="auto">
            Add Category
          </Button>

          <HoneyList
            items={featureCategories}
            isLoading={isFeatureCategoriesLoading}
            isError={isFeatureCategoriesError}
            itemKey="id"
            $gap={1}
            loadingContent="Loading..."
            noContent="No feature categories"
          >
            {featureCategory => (
              <ManageFeatureCategoryListItem
                featureCategory={featureCategory}
                isSelected={featureCategory.id === selectedFeatureCategory?.id}
                onSelect={setSelectedFeatureCategory}
                onEdit={setEditFeatureCategory}
              />
            )}
          </HoneyList>
        </HoneyGridColumn>

        <HoneyGridColumn
          $gap={2}
          $padding={1}
          $borderRadius="4px"
          $border="1px solid"
          $borderColor="secondary.softGray"
        >
          <Button
            disabled={!selectedFeatureCategory}
            onClick={() => setIsAddFeature(true)}
            $marginLeft="auto"
          >
            Add Feature
          </Button>

          {selectedFeatureCategory ? (
            <HoneyList
              items={features}
              isLoading={isFeaturesLoading}
              isError={isFeaturesError}
              itemKey="id"
              $gap={1}
              loadingContent="Loading..."
              noContent="No features for selected category"
            >
              {feature => <ManageFeatureListItem feature={feature} onEdit={() => {}} />}
            </HoneyList>
          ) : (
            'Please, select feature category to manage features'
          )}
        </HoneyGridColumn>
      </HoneyGrid>

      <AddFeatureCategoryDialog
        isOpen={isAddFeatureCategory}
        onClose={() => setIsAddFeatureCategory(false)}
        onSuccess={refetchFeatureCategories}
      />

      <EditFeatureCategoryDialog
        featureCategory={editFeatureCategory}
        isOpen={Boolean(editFeatureCategory)}
        onClose={() => setEditFeatureCategory(null)}
        onSuccess={refetchFeatureCategories}
      />

      <AddFeatureDialog
        isOpen={isAddFeature}
        categoryId={selectedFeatureCategory?.id}
        onClose={() => setIsAddFeature(false)}
        onSuccess={refetchFeatures}
      />
    </Panel>
  );
};
