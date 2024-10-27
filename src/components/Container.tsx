import type { DataAttributes } from 'styled-components';
import styled, { css } from 'styled-components';
import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { resolveSpacing, HoneyFlexBox } from '@react-hive/honey-layout';

type ContainerProps = DataAttributes & HoneyBoxProps;

export const Container = styled(HoneyFlexBox)<ContainerProps>`
  ${({ theme }) => css`
    width: 100%;
    max-width: ${theme.container.maxWidth};

    margin: 0 auto;
    padding: ${resolveSpacing(2)};
  `}
`;

Container.defaultProps = {
  'data-testid': 'container',
};
