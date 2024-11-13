import React from 'react';
import type { HoneyFormOnSubmit } from '@react-hive/honey-form';
import { HoneyForm } from '@react-hive/honey-form';
import { HoneyFlexBox } from '@react-hive/honey-layout';
import { toast } from 'react-toastify';

import type { FeatureCategoryId } from '~/api';
import type { DialogProps } from '~/components';
import type { FeatureFormData } from '~/pages';
import { assert } from '~/helpers';
import { addFeature, handlerApiError } from '~/api';
import { Button, Dialog, TextInput } from '~/components';
import { FEATURE_FORM_FIELDS } from '~/pages';

type AddFeatureDialogProps = Omit<DialogProps, 'children' | 'title'> & {
  categoryId: FeatureCategoryId | undefined;
  onSuccess: () => Promise<unknown>;
};

export const AddFeatureDialog = ({ categoryId, onSuccess, ...props }: AddFeatureDialogProps) => {
  const { onClose } = props;

  const handleAddFeature: HoneyFormOnSubmit<FeatureFormData> = async data => {
    assert(categoryId, 'The category id must be provided');

    try {
      await addFeature({
        categoryId,
        measurementId: '0000-0000-0000-0000',
        name: data.name,
      });

      toast('The new feature was added', {
        type: 'success',
      });

      onClose();
      await onSuccess();
    } catch (e) {
      handlerApiError(e);
    }
  };

  return (
    <Dialog title="Add Feature" {...props}>
      <HoneyForm fields={FEATURE_FORM_FIELDS} onSubmit={handleAddFeature}>
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
