import React, { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { resolveFont } from '@react-hive/honey-layout';

const TextInputStyled = styled.div`
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

      border: 1px solid ${colors.neutral.gray};
      border-radius: 4px;
      color: ${colors.neutral.mediumGray};

      &:-webkit-autofill {
        -webkit-background-clip: text;
      }

      &:has(~ .text-input__error) {
        border-color: ${colors.error.redLight};
      }
    }

    .text-input__error {
      ${resolveFont('caption1')}

      color: ${colors.error.crimsonRed};
    }
  `}
`;

type TextInputProps = {
  label: string;
  error?: ReactNode;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, inputProps, ...props }, ref) => {
    const id = useId();

    return (
      <TextInputStyled {...props}>
        <label htmlFor={id}>{label}</label>

        <input ref={ref} id={id} {...inputProps} />

        {error && <p className="text-input__error">{error}</p>}
      </TextInputStyled>
    );
  },
);
