import React from 'react';
import type { HoneyFormOnSubmit } from '@react-hive/honey-form';
import { HoneyForm } from '@react-hive/honey-form';
import { HoneyBox, HoneyFlexBox } from '@react-hive/honey-layout';
import { toast } from 'react-toastify';

import type { DialogProps } from '~/components';
import type { CategoryFormData } from '../ManageCategoriesPage.types';
import { CATEGORY_FORM_FIELDS } from '../ManageCategoriesPage.constants';
import { Text, Button, Dialog, TextInput } from '~/components';
import { addCategory, handlerApiError } from '~/api';

type AddCategoryDialogProps = Omit<DialogProps, 'children' | 'title'> & {
  onSuccess: () => Promise<unknown>;
};

export const AddCategoryDialog = ({ onSuccess, ...props }: AddCategoryDialogProps) => {
  const { onClose } = props;

  const handleAddCategory: HoneyFormOnSubmit<CategoryFormData> = async data => {
    try {
      await addCategory({
        name: data.name,
        icon: data.icon,
        isVisible: data.isVisible,
      });

      toast('The new category was added', {
        type: 'success',
      });

      onClose();
      await onSuccess();
    } catch (e) {
      handlerApiError(e);
    }
  };

  return (
    <Dialog title="Add Category" {...props}>
      <HoneyForm fields={CATEGORY_FORM_FIELDS} onSubmit={handleAddCategory}>
        {({ formFields, formValues, isFormSubmitAllowed }) => (
          <HoneyFlexBox $gap={2} $width="350px">
            <TextInput
              label="* Name"
              error={formFields.name.errors[0]?.message}
              {...formFields.name.props}
            />

            <HoneyFlexBox $gap={1}>
              <Text variant="caption2">Visible</Text>

              <HoneyBox $display="flex" $gap={1} $alignItems="center">
                <label>
                  <input
                    type="radio"
                    name="isVisible"
                    checked={formValues.isVisible}
                    onChange={() => formFields.isVisible.setValue(true)}
                  />
                  Yes
                </label>

                <label>
                  <input
                    type="radio"
                    name="isVisible"
                    checked={!formValues.isVisible}
                    onChange={() => formFields.isVisible.setValue(false)}
                  />
                  No
                </label>
              </HoneyBox>
            </HoneyFlexBox>

            <Button disabled={!isFormSubmitAllowed} type="submit" $marginLeft="auto">
              Add
            </Button>
          </HoneyFlexBox>
        )}
      </HoneyForm>
    </Dialog>
  );
};
