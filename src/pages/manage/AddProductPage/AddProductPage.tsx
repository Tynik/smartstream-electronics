import React from 'react';
import type { HoneyFormFieldsConfig, HoneyFormOnSubmit } from '@react-hive/honey-form';
import { HoneyForm } from '@react-hive/honey-form';
import { HoneyFlexBox, HoneyList } from '@react-hive/honey-layout';
import { useNavigate } from 'react-router-dom';

import type { Category, UploadedFile } from '~/api';
import { MANAGE_PRODUCTS_ROUTE_PATH } from '~/constants';
import { addProduct, deleteFile, handlerApiError, uploadFile } from '~/api';
import { SelectCategory } from '~/features';
import { Button, Panel, SelectFilesWrapper } from '~/components';
import { ProductImagePreview } from './components';
import { assert } from '~/helpers';

type AddProductFormData = {
  category: Category | undefined;
  images: File[] | undefined;
};

const ADD_PRODUCT_FORM_FIELDS: HoneyFormFieldsConfig<AddProductFormData> = {
  category: {
    type: 'object',
  },
  images: {
    type: 'file',
  },
};

export const AddProductPage = () => {
  const navigate = useNavigate();

  const handleAddProduct: HoneyFormOnSubmit<AddProductFormData> = async data => {
    assert(data.category, 'Must be set');

    let uploadedImages: UploadedFile[] = [];

    try {
      uploadedImages = await Promise.all(data.images?.map(file => uploadFile(file, 'image')) ?? []);

      await addProduct({
        categoryId: data.category.id,
        stripeProductId: null,
        title: 'test',
        subtitle: null,
        content: 'test-content',
        totalQuantity: 0,
        files: uploadedImages.map(uploadedImage => ({
          fileId: uploadedImage.id,
          type: 'image',
        })),
      });

      navigate(MANAGE_PRODUCTS_ROUTE_PATH);
    } catch (e) {
      // Remove uploaded files when something going wrong
      await Promise.all(uploadedImages.map(uploadedImage => deleteFile(uploadedImage.id)));

      handlerApiError(e);
    }
  };

  return (
    <Panel title="Add Product">
      <HoneyForm fields={ADD_PRODUCT_FORM_FIELDS} onSubmit={handleAddProduct}>
        {({ formFields, formValues, isFormSubmitAllowed }) => (
          <HoneyFlexBox $gap={2} $width="100%" $maxWidth="600px" $margin="0 auto">
            <SelectFilesWrapper onSelectFiles={formFields.images.setValue}>
              <Button as="div">Select Images</Button>
            </SelectFilesWrapper>

            <HoneyList
              items={formValues.images ?? []}
              itemKey="name"
              $flexDirection="row"
              $flexWrap="wrap"
              $gap={1}
            >
              {image => <ProductImagePreview image={image} />}
            </HoneyList>

            <SelectCategory value={formValues.category} onChange={formFields.category.setValue} />

            <Button disabled={!isFormSubmitAllowed} type="submit" $marginLeft="auto">
              Add
            </Button>
          </HoneyFlexBox>
        )}
      </HoneyForm>
    </Panel>
  );
};
