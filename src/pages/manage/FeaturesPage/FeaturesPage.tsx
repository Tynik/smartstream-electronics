import type { HoneyFormOnSubmit } from '@react-hive/honey-form';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HoneyForm } from '@react-hive/honey-form';
import {
  HoneyBox,
  HoneyFlexBox,
  HoneyGrid,
  HoneyGridColumn,
  HoneyList,
} from '@react-hive/honey-layout';
import { toast } from 'react-toastify';

import type { Nullable } from '~/types';
import type { FeatureCategory } from '~/api';
import type { FeatureCategoryFormData } from '~/pages';
import { assert } from '~/helpers';
import { getFeatures, updateFeatureCategory, getFeatureCategories, handlerApiError } from '~/api';
import { Button, Loading, Dialog, Panel, TextInput } from '~/components';
import {
  AddFeatureDialog,
  FeatureCategoryListItem,
  FeatureListItem,
  AddFeatureCategoryDialog,
  FEATURE_CATEGORY_FORM_FIELDS,
} from '~/pages';

export const FeaturesPage = () => {
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

  const handleUpdateFeatureCategory: HoneyFormOnSubmit<FeatureCategoryFormData> = async data => {
    assert(editFeatureCategory, 'The `editFeatureCategory` must be set');

    try {
      await updateFeatureCategory({
        id: editFeatureCategory.id,
        name: data.name,
      });

      setEditFeatureCategory(null);

      toast('The new feature category was successfully updated', {
        type: 'success',
      });

      await refetchFeatureCategories();
    } catch (e) {
      handlerApiError(e);
    }
  };

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
              <FeatureCategoryListItem
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
              {feature => <FeatureListItem feature={feature} onEdit={() => {}} />}
            </HoneyList>
          ) : (
            'Please, select feature category to manage features'
          )}
        </HoneyGridColumn>
      </HoneyGrid>

      <AddFeatureCategoryDialog
        isOpen={isAddFeatureCategory}
        onClose={() => setIsAddFeatureCategory(false)}
        onSuccess={() => {
          setIsAddFeatureCategory(false);

          return refetchFeatureCategories();
        }}
      />

      <AddFeatureDialog
        isOpen={isAddFeature}
        categoryId={selectedFeatureCategory?.id}
        onClose={() => setIsAddFeature(false)}
        onSuccess={() => {
          setIsAddFeature(false);

          return refetchFeatures();
        }}
      />

      <Dialog
        isOpen={Boolean(editFeatureCategory)}
        onClose={() => setEditFeatureCategory(null)}
        title="Edit Feature Category"
      >
        {({ closeDialog }) => (
          <HoneyForm
            fields={FEATURE_CATEGORY_FORM_FIELDS}
            defaults={{
              name: editFeatureCategory?.name,
            }}
            onSubmit={handleUpdateFeatureCategory}
          >
            {({ formFields, isFormSubmitAllowed }) => (
              <HoneyFlexBox $gap={2} $width="350px">
                <TextInput
                  label="* Name"
                  error={formFields.name.errors[0]?.message}
                  {...formFields.name.props}
                />

                <HoneyBox $display="flex" $gap={1} $marginLeft="auto">
                  <Button disabled={!isFormSubmitAllowed} type="submit">
                    Save
                  </Button>

                  <Button disabled={!isFormSubmitAllowed} onClick={closeDialog}>
                    Cancel
                  </Button>
                </HoneyBox>
              </HoneyFlexBox>
            )}
          </HoneyForm>
        )}
      </Dialog>
    </Panel>
  );
};
