import React from 'react';
import { HoneyForm, HoneyFormFieldsConfig, HoneyFormOnSubmit } from '@react-hive/honey-form';
import { HoneyFlexBox } from '@react-hive/honey-layout';
import { useNavigate } from 'react-router-dom';

import { Button, Panel } from '~/components';
import { PRODUCTS_ROUTE_PATH } from '~/constants';
import { handlerApiError } from '~/api';

type AddProductFormData = {
  //
};

const ADD_PRODUCT_FORM_FIELDS: HoneyFormFieldsConfig<AddProductFormData> = {
  //
};

export const AddProductPage = () => {
  const navigate = useNavigate();

  const handleAddProduct: HoneyFormOnSubmit<AddProductFormData> = async data => {
    try {
      //

      navigate(PRODUCTS_ROUTE_PATH);
    } catch (e) {
      handlerApiError(e);
    }
  };

  return (
    <Panel title="Add Product">
      <HoneyForm fields={ADD_PRODUCT_FORM_FIELDS} onSubmit={handleAddProduct}>
        {({ formFields, isFormSubmitAllowed }) => (
          <HoneyFlexBox $gap={2} $width="100%" $maxWidth="350px" $margin="0 auto">
            <Button disabled={!isFormSubmitAllowed} type="submit" $marginLeft="auto">
              Add
            </Button>
          </HoneyFlexBox>
        )}
      </HoneyForm>
    </Panel>
  );
};
