import type { PropsWithChildren } from 'react';
import React from 'react';
import styled from 'styled-components';

import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { HoneyFlexBox } from '@react-hive/honey-layout';
import { Text } from '~/components';

const PanelStyled = styled(HoneyFlexBox)``;

PanelStyled.defaultProps = {
  $gap: 2,
  $padding: 3,
  $borderRadius: '8px',
  $border: '1px solid',
  $borderColor: 'secondary.lightGray',
  $boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  $backgroundColor: 'white',
};

type PanelProps = HoneyBoxProps & {
  title?: string;
};

export const Panel = ({ children, title, ...props }: PropsWithChildren<PanelProps>) => {
  return (
    <PanelStyled {...props}>
      {title && (
        <Text variant="h4" $fontWeight="bold" $marginBottom={1}>
          {title}
        </Text>
      )}

      {children}
    </PanelStyled>
  );
};
