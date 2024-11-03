import React from 'react';
import type { HoneyFormFieldsConfig, HoneyFormOnSubmit } from '@react-hive/honey-form';
import { HoneyForm } from '@react-hive/honey-form';
import { HoneyBox, HoneyFlexBox } from '@react-hive/honey-layout';
import { NavLink, useNavigate } from 'react-router-dom';

import { SIGN_IN_ROUTE_PATH } from '~/constants';
import { Button, Panel, Text, TextInput } from '~/components';
import { handlerApiError, netlifyRequest } from '~/api';

type SignUpFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
};

const SIGN_UP_FORM_FIELDS: HoneyFormFieldsConfig<SignUpFormData> = {
  firstName: {
    type: 'string',
    required: true,
    max: 50,
  },
  lastName: {
    type: 'string',
    required: true,
    max: 50,
  },
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
  repeatPassword: {
    type: 'string',
    required: true,
    mode: 'blur',
    validator: (value, { formValues }) =>
      value === formValues.password || 'Passwords must be equal',
  },
};

export const SignUpPage = () => {
  const navigate = useNavigate();

  const handleSignUp: HoneyFormOnSubmit<SignUpFormData> = async data => {
    try {
      await netlifyRequest('sign-up', {
        method: 'POST',
        payload: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        },
      });

      navigate(SIGN_IN_ROUTE_PATH);
    } catch (e) {
      handlerApiError(e);
    }
  };

  return (
    <HoneyFlexBox $flexGrow={1} $justifyContent="center">
      <Panel title="Sign Up" $width="100%" $maxWidth="600px" $margin="0 auto" $padding={[5, 2]}>
        <HoneyForm fields={SIGN_UP_FORM_FIELDS} onSubmit={handleSignUp}>
          {({ formFields, isFormSubmitAllowed }) => (
            <HoneyFlexBox $gap={2} $width="100%" $maxWidth="350px" $margin="0 auto">
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
                label="* Email"
                error={formFields.email.errors[0]?.message}
                {...formFields.email.props}
              />

              <TextInput
                label="* Password"
                error={formFields.password.errors[0]?.message}
                {...formFields.password.props}
                type="password"
              />

              <TextInput
                label="* Repeat Password"
                error={formFields.repeatPassword.errors[0]?.message}
                {...formFields.repeatPassword.props}
                type="password"
              />

              <HoneyBox $display="flex" $gap={2} $alignItems="center">
                <NavLink to={SIGN_IN_ROUTE_PATH}>
                  <Text variant="body2" $fontWeight="500" $color="primary.dodgerBlue">
                    Sign In
                  </Text>
                </NavLink>

                <Button disabled={!isFormSubmitAllowed} type="submit" $marginLeft="auto">
                  Sign Up
                </Button>
              </HoneyBox>
            </HoneyFlexBox>
          )}
        </HoneyForm>
      </Panel>
    </HoneyFlexBox>
  );
};
