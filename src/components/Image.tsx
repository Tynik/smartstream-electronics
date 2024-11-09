import React from 'react';
import styled from 'styled-components';

import { useObjectUrl } from '~/hooks';

const ImageStyled = styled.img`
  width: 100%;
  height: 100%;

  object-fit: contain;
`;

type ImageProps = {
  file: File;
};

export const Image = ({ file }: ImageProps) => {
  const objectUrl = useObjectUrl(file);

  if (!objectUrl) {
    return null;
  }

  return <ImageStyled src={objectUrl} alt="" />;
};
