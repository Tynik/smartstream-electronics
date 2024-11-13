import React from 'react';
import type { HoneyFormOnSubmit } from '@react-hive/honey-form';
import { HoneyForm } from '@react-hive/honey-form';
import { HoneyBox, HoneyFlexBox } from '@react-hive/honey-layout';
import { toast } from 'react-toastify';

import type { Nullable } from '~/types';
import type { FeatureCategory } from '~/api';
import type { DialogProps } from '~/components';
import type { FeatureCategoryFormData } from '~/pages';
import { assert } from '~/helpers';
import { FEATURE_CATEGORY_FORM_FIELDS } from '~/pages';
import { Button, Dialog, TextInput } from '~/components';
import { handlerApiError, updateFeatureCategory } from '~/api';

type EditFeatureCategoryDialogProps = Omit<DialogProps, 'children' | 'title'> & {
  featureCategory: Nullable<FeatureCategory>;
  onSuccess: () => Promise<unknown>;
};

export const EditFeatureCategoryDialog = ({
  featureCategory,
  onSuccess,
  ...props
}: EditFeatureCategoryDialogProps) => {
  const { onClose } = props;

  const handleUpdateFeatureCategory: HoneyFormOnSubmit<FeatureCategoryFormData> = async data => {
    assert(featureCategory, 'The `editFeatureCategory` must be set');

    try {
      await updateFeatureCategory({
        id: featureCategory.id,
        name: data.name,
      });

      toast('The new feature category was successfully updated', {
        type: 'success',
      });

      onClose();
      await onSuccess();
    } catch (e) {
      handlerApiError(e);
    }
  };

  return (
    <Dialog title="Edit Feature Category" {...props}>
      {({ closeDialog }) => (
        <HoneyForm
          fields={FEATURE_CATEGORY_FORM_FIELDS}
          defaults={{
            name: featureCategory?.name,
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
  );
};
