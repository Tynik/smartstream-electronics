import React from 'react';
import type { HoneyFormFieldsConfig, HoneyFormOnSubmit } from '@react-hive/honey-form';
import { HoneyForm } from '@react-hive/honey-form';
import { HoneyFlexBox, HoneyList } from '@react-hive/honey-layout';
import { useNavigate } from 'react-router-dom';

import type { Category, UploadedFile } from '~/api';
import { MANAGE_PRODUCTS_ROUTE_PATH } from '~/constants';
import { addProduct, deleteFile, handlerApiError, uploadFile } from '~/api';
import { SelectCategory } from '~/features';
import { Button, Editor, Panel, SelectFilesWrapper, TextInput } from '~/components';
import { ProductImagePreview } from './components';
import { assert } from '~/helpers';

type AddProductFormData = {
  category: Category | undefined;
  images: File[] | undefined;
  title: string;
  subTitle: string;
  content: string;
};

const ADD_PRODUCT_FORM_FIELDS: HoneyFormFieldsConfig<AddProductFormData> = {
  category: {
    type: 'object',
    required: true,
  },
  images: {
    type: 'file',
  },
  title: {
    type: 'string',
    required: true,
  },
  subTitle: {
    type: 'string',
  },
  content: {
    type: 'string',
    required: true,
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
        title: data.title,
        subtitle: data.subTitle,
        content: data.content,
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

            <SelectCategory
              value={formValues.category}
              error={formFields.category.errors[0]?.message}
              onChange={formFields.category.setValue}
            />

            <TextInput
              label="* Title"
              error={formFields.title.errors[0]?.message}
              {...formFields.title.props}
            />

            <TextInput
              label="Subtitle"
              error={formFields.subTitle.errors[0]?.message}
              {...formFields.subTitle.props}
            />

            <Editor value={formValues.content} onChange={formFields.content.setValue} />

            <Button disabled={!isFormSubmitAllowed} type="submit" $marginLeft="auto">
              Add
            </Button>
          </HoneyFlexBox>
        )}
      </HoneyForm>
    </Panel>
  );
};
