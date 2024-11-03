import React from 'react';
import type { HoneyFormFieldsConfig, HoneyFormOnSubmit } from '@react-hive/honey-form';
import { HoneyForm } from '@react-hive/honey-form';
import { HoneyBox, HoneyFlexBox } from '@react-hive/honey-layout';
import { NavLink, useNavigate } from 'react-router-dom';

import { PROFILE_ROUTE_PATH, SIGN_UP_ROUTE_PATH } from '~/constants';
import { handlerApiError, netlifyRequest } from '~/api';
import { useQueryParams } from '~/hooks';
import { Alert, Button, Panel, Text, TextInput } from '~/components';

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
  const navigate = useNavigate();
  const queryParams = useQueryParams();

  const handleSignIn: HoneyFormOnSubmit<SignInFormData> = async data => {
    try {
      await netlifyRequest('sign-in', {
        method: 'POST',
        payload: {
          email: data.email,
          password: data.password,
        },
      });

      navigate(PROFILE_ROUTE_PATH);
    } catch (e) {
      handlerApiError(e);
    }
  };

  const isEmailConfirmed = queryParams.get('emailConfirmed') === 'true';

  return (
    <HoneyFlexBox $flexGrow={1} $justifyContent="center">
      <Panel title="Sign In" $width="100%" $maxWidth="600px" $margin="0 auto" $padding={[5, 2]}>
        {isEmailConfirmed && (
          <Alert>
            Your email has been successfully confirmed! You can now proceed to sign in below.
          </Alert>
        )}

        <HoneyForm fields={SIGN_IN_FORM_FIELDS} onSubmit={handleSignIn}>
          {({ formFields, isFormSubmitAllowed }) => (
            <HoneyFlexBox $gap={2} $width="100%" $maxWidth="350px" $margin="0 auto">
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

              <HoneyBox $display="flex" $gap={2} $alignItems="center">
                <NavLink to={SIGN_UP_ROUTE_PATH}>
                  <Text variant="body2" $fontWeight="500" $color="primary.dodgerBlue">
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
      </Panel>
    </HoneyFlexBox>
  );
};
