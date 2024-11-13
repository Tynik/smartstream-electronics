import React from 'react';
import type { HoneyFormOnSubmit } from '@react-hive/honey-form';
import { HoneyForm } from '@react-hive/honey-form';
import { HoneyFlexBox } from '@react-hive/honey-layout';
import { toast } from 'react-toastify';

import type { DialogProps } from '~/components';
import type { FeatureCategoryFormData } from '~/pages';
import { Button, Dialog, TextInput } from '~/components';
import { addFeatureCategory, handlerApiError } from '~/api';
import { FEATURE_CATEGORY_FORM_FIELDS } from '~/pages';

type AddFeatureCategoryDialogProps = Omit<DialogProps, 'children' | 'title'> & {
  onSuccess: () => Promise<unknown>;
};

export const AddFeatureCategoryDialog = ({
  onSuccess,
  ...props
}: AddFeatureCategoryDialogProps) => {
  const { onClose } = props;

  const handleAddFeatureCategory: HoneyFormOnSubmit<FeatureCategoryFormData> = async data => {
    try {
      await addFeatureCategory({
        name: data.name,
      });

      toast('The new feature category was added', {
        type: 'success',
      });

      onClose();
      await onSuccess();
    } catch (e) {
      handlerApiError(e);
    }
  };

  return (
    <Dialog title="Add Feature Category" {...props}>
      <HoneyForm fields={FEATURE_CATEGORY_FORM_FIELDS} onSubmit={handleAddFeatureCategory}>
        {({ formFields, isFormSubmitAllowed }) => (
          <HoneyFlexBox $gap={2} $width="350px">
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
  );
};
