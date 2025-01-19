import styled, { css } from 'styled-components';
import { HoneyBox, resolveFont } from '@react-hive/honey-layout';

export const TextInputStyled = styled(HoneyBox)`
  ${({ theme: { colors } }) => css`
    display: flex;
    flex-direction: column;
    gap: 2px;

    label {
      ${resolveFont('caption2')}

      color: ${colors.neutral.darkGray};

      &:has(~ input:focus) {
        color: ${colors.neutral.royalBlue};
      }
    }

    input {
      ${resolveFont('body2')}

      padding: 8px;

      border: 1px solid ${colors.secondary.mediumLightGray};
      border-radius: 4px;
      color: ${colors.neutral.mediumGray};

      &:-webkit-autofill {
        -webkit-background-clip: text;
      }

      &:has(~ .text-input__error) {
        border-color: ${colors.error.crimsonRed};
      }
    }

    .text-input__error {
      ${resolveFont('caption1')}

      color: ${colors.error.crimsonRed};
    }
  `}
`;
