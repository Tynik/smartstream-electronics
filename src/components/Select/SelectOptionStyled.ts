import styled, { css } from 'styled-components';

import type { TextProps } from '~/components';
import { Text } from '~/components';

export const SelectOptionStyled = styled(Text).attrs({
  variant: 'body2',
  $padding: 1,
})<TextProps>`
  ${({ theme: { colors } }) => css`
    border-radius: 4px;
    cursor: pointer;

    &[aria-selected='true'] {
      color: ${colors.success.emeraldGreen};
    }

    &:hover {
      background-color: ${colors.secondary.extraLightGray};
    }
  `}
`;
