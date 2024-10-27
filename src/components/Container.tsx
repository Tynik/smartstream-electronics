import styled, { css } from 'styled-components';
import { HoneyFlexBox } from '@react-hive/honey-layout';

export const Container = styled(HoneyFlexBox)`
  ${({ theme }) => css`
    width: 100%;
    max-width: ${theme.container.maxWidth};

    margin: 0 auto;
    padding: 16px;
  `}
`;
