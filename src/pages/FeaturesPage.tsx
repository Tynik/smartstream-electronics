import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { HoneyFormFieldsConfig, HoneyFormOnSubmit } from '@react-hive/honey-form';
import { HoneyForm } from '@react-hive/honey-form';
import {
  HoneyBox,
  HoneyFlexBox,
  HoneyGrid,
  HoneyGridColumn,
  HoneyList,
} from '@react-hive/honey-layout';
import { toast } from 'react-toastify';

import { addFeatureCategory, getFeatureCategories, handlerApiError } from '~/api';
import { Button, Loading, Dialog, Panel, TextInput, Text } from '~/components';

type AddFeatureCategoryFormData = {
  name: string;
};

const ADD_FEATURE_CATEGORY_FORM_FIELDS: HoneyFormFieldsConfig<AddFeatureCategoryFormData> = {
  name: {
    type: 'string',
    required: true,
    max: 25,
  },
};

export const FeaturesPage = () => {
  const [isAddCategory, setIsAddCategory] = useState(false);

  const {
    data: featureCategories,
    isLoading: isFeatureCategoriesLoading,
    refetch: refetchFeatureCategories,
  } = useQuery({
    queryKey: ['feature-categories'],
    queryFn: getFeatureCategories,
  });

  const handleAddFeatureCategory: HoneyFormOnSubmit<AddFeatureCategoryFormData> = async data => {
    try {
      await addFeatureCategory({
        name: data.name,
      });

      setIsAddCategory(false);

      toast('The new feature category was successfully added', {
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
      <Button onClick={() => setIsAddCategory(true)}>Add Category</Button>

      <HoneyGrid columns={2} spacing={2}>
        <HoneyGridColumn $borderRadius="4px" $border="1px solid" $borderColor="secondary.softGray">
          <HoneyList
            items={featureCategories}
            itemKey="id"
            $display="flex"
            $flexDirection="column"
            $gap={0.5}
          >
            {featureCategory => (
              <HoneyBox $display="flex" $padding={1}>
                <Text variant="subtitle2">{featureCategory.name}</Text>
              </HoneyBox>
            )}
          </HoneyList>
        </HoneyGridColumn>

        <HoneyGridColumn $borderRadius="4px" $border="1px solid" $borderColor="secondary.softGray">
          2
        </HoneyGridColumn>
      </HoneyGrid>

      <Dialog
        isOpen={isAddCategory}
        onClose={() => setIsAddCategory(false)}
        title="Add Feature Category"
      >
        <HoneyForm
          fields={ADD_FEATURE_CATEGORY_FORM_FIELDS}
          onSubmit={handleAddFeatureCategory}
          resetAfterSubmit
        >
          {({ formFields, isFormSubmitAllowed }) => (
            <HoneyFlexBox $gap={2}>
              <TextInput
                label="* Name"
                error={formFields.name.errors[0]?.message}
                {...formFields.name.props}
              />

              <Button disabled={!isFormSubmitAllowed} type="submit" $marginLeft="auto">
                Add
              </Button>
            </HoneyFlexBox>
          )}
        </HoneyForm>
      </Dialog>
    </Panel>
  );
};
