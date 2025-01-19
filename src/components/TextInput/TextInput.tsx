import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import React, { forwardRef, useId } from 'react';

import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { TextInputStyled } from './TextInputStyled';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

type TextInputProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> &
  HoneyBoxProps &
  Pick<InputProps, 'value' | 'placeholder' | 'onChange'> & {
    label: string;
    error?: ReactNode;
    inputProps?: Omit<InputProps, 'value'>;
  };

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ value, label, error, onChange, inputProps, ...props }, ref) => {
    const id = useId();

    return (
      <TextInputStyled {...props}>
        <label htmlFor={id}>{label}</label>

        <input
          ref={ref}
          id={id}
          value={value}
          onChange={onChange}
          // ARIA
          aria-invalid={Boolean(error)}
          {...inputProps}
        />

        {error && <p className="text-input__error">{error}</p>}
      </TextInputStyled>
    );
  },
);

TextInput.displayName = 'TextInput';
