import React, { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

import { TextInputStyled } from './TextInputStyled';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: ReactNode;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, ...props }, ref) => {
    const id = useId();

    return (
      <TextInputStyled>
        <label htmlFor={id}>{label}</label>

        <input ref={ref} id={id} {...props} />

        {error && <p className="text-input__error">{error}</p>}
      </TextInputStyled>
    );
  },
);
