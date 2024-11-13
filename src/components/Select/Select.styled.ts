import styled, { css } from 'styled-components';
import { HoneyBox, resolveFont } from '@react-hive/honey-layout';

export const SelectStyled = styled(HoneyBox)`
  ${({ theme: { colors } }) => css`
    position: relative;
    width: 100%;

    input[aria-invalid='true'] {
      border-color: ${colors.error.crimsonRed};
    }

    .text-input__error {
      ${resolveFont('caption1')}

      color: ${colors.error.crimsonRed};
    }
  `}
`;
