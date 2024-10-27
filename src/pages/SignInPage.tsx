import React from 'react';
import type { HoneyFormFieldsConfig, HoneyFormOnSubmit } from '@react-hive/honey-form';
import { HoneyForm } from '@react-hive/honey-form';
import { HoneyBox, HoneyFlexBox } from '@react-hive/honey-layout';
import { NavLink } from 'react-router-dom';

import { SIGN_UP_ROUTE_PATH } from '~/constants';
import { handlerApiError, netlifyRequest } from '~/api';
import { Button, Text, TextInput } from '~/components';

type SignInFormData = {
  email: string;
  password: string;
};

const SIGN_IN_FORM_FIELDS: HoneyFormFieldsConfig<SignInFormData> = {
  email: {
    type: 'email',
    required: true,
    mode: 'blur',
    max: 255,
  },
  password: {
    type: 'string',
    required: true,
    mode: 'blur',
    min: 6,
    max: 25,
  },
};

export const SignInPage = () => {
  const handleSignIn: HoneyFormOnSubmit<SignInFormData> = async data => {
    try {
      await netlifyRequest('sign-in', {
        method: 'POST',
        payload: {
          email: data.email,
          password: data.password,
        },
      });
    } catch (e) {
      handlerApiError(e);
    }
  };

  return (
    <HoneyFlexBox $flexGrow={1} $justifyContent="center">
      <HoneyForm fields={SIGN_IN_FORM_FIELDS} onSubmit={handleSignIn}>
        {({ formFields, isFormSubmitAllowed }) => (
          <HoneyFlexBox $gap={2} $width="100%" $maxWidth="350px" $margin="0 auto">
            <TextInput
              label="Email"
              error={formFields.email.errors[0]?.message}
              {...formFields.email.props}
            />

            <TextInput
              label="Password"
              inputProps={{
                type: 'password',
              }}
              error={formFields.password.errors[0]?.message}
              {...formFields.password.props}
            />

            <HoneyBox $display="flex" $gap={2} $alignItems="center">
              <NavLink to={SIGN_UP_ROUTE_PATH}>
                <Text variant="body2" $fontWeight="500" $color="neutral.darkBlue">
                  Sign Up
                </Text>
              </NavLink>

              <Button disabled={!isFormSubmitAllowed} type="submit" $marginLeft="auto">
                Sign In
              </Button>
            </HoneyBox>
          </HoneyFlexBox>
        )}
      </HoneyForm>
    </HoneyFlexBox>
  );
};
