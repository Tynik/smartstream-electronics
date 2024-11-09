import React from 'react';
import { HoneyBox } from '@react-hive/honey-layout';

import { Image } from '~/components';

type ProductImagePreviewProps = {
  image: File;
};

export const ProductImagePreview = ({ image }: ProductImagePreviewProps) => {
  return (
    <HoneyBox
      $width="150px"
      $height="150px"
      $borderRadius="4px"
      $border="1px solid"
      $borderColor="secondary.softGray"
      $overflow="hidden"
    >
      <Image file={image} />
    </HoneyBox>
  );
};
