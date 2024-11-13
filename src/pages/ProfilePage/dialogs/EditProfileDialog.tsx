import React from 'react';
import type { HoneyFormOnSubmit } from '@react-hive/honey-form';
import { HoneyForm } from '@react-hive/honey-form';
import { HoneyBox, HoneyFlexBox } from '@react-hive/honey-layout';
import { toast } from 'react-toastify';

import type { DialogProps } from '~/components';
import type { EditProfileFormData } from '../ProfilePage.types';
import { EDIT_PROFILE_FORM_FIELDS } from '../ProfilePage.constants';
import { assert } from '~/helpers';
import { updateProfile, handlerApiError } from '~/api';
import { useCurrentApp } from '~/providers';
import { Button, Dialog, TextInput } from '~/components';

type EditProfileDialogProps = Omit<DialogProps, 'children' | 'title'>;

export const EditProfileDialog = (props: EditProfileDialogProps) => {
  const { onClose } = props;

  const { profile, refetchProfile } = useCurrentApp();

  const handleUpdateProfile: HoneyFormOnSubmit<EditProfileFormData> = async data => {
    assert(profile, 'The `profile` must be set');

    try {
      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });

      toast('The profile was successfully updated', {
        type: 'success',
      });

      onClose();
      await refetchProfile();
    } catch (e) {
      handlerApiError(e);
    }
  };

  return (
    <Dialog title="Edit Profile" {...props}>
      {({ closeDialog }) => (
        <HoneyForm
          fields={EDIT_PROFILE_FORM_FIELDS}
          defaults={{
            firstName: profile?.firstName,
            lastName: profile?.lastName,
            phone: profile?.phone ?? '',
          }}
          onSubmit={handleUpdateProfile}
        >
          {({ formFields, isFormSubmitAllowed }) => (
            <HoneyFlexBox $gap={2} $width="350px">
              <TextInput
                label="* First Name"
                error={formFields.firstName.errors[0]?.message}
                {...formFields.firstName.props}
              />

              <TextInput
                label="* Last Name"
                error={formFields.lastName.errors[0]?.message}
                {...formFields.lastName.props}
              />

              <TextInput
                label="* Phone"
                error={formFields.phone.errors[0]?.message}
                placeholder="07XXXXXXXXX"
                {...formFields.phone.props}
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
