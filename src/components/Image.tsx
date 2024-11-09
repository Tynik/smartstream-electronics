import React from 'react';
import styled from 'styled-components';

import { useObjectUrl } from '~/hooks';

const ImageStyled = styled.img`
  width: 100%;
  height: 100%;

  object-fit: contain;
`;

type ImageProps = {
  src: File | string;
};

export const Image = ({ src }: ImageProps) => {
  const objectUrl = useObjectUrl(typeof src === 'string' ? undefined : src);

  const imgSrc = typeof src === 'string' ? src : objectUrl;

  if (!imgSrc) {
    return null;
  }

  return <ImageStyled src={imgSrc} alt="" />;
};
