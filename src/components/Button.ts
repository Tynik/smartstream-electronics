import styled, { css } from 'styled-components';
import type { ButtonHTMLAttributes } from 'react';
import type { HoneyBoxProps, HoneyCSSDimensionValue } from '@react-hive/honey-layout';
import { HoneyBox } from '@react-hive/honey-layout';

type ButtonSize = 'small' | 'medium' | 'large';

const sizeMap: Record<ButtonSize, HoneyCSSDimensionValue> = {
  small: '80px',
  medium: '120px',
  large: '160px',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  HoneyBoxProps & {
    size?: ButtonSize;
  };

export const Button = styled(HoneyBox).attrs<ButtonProps>(({ type }) => ({
  as: 'button',
  type: type ?? 'button',
}))<ButtonProps>`
  ${({ size = 'medium' }) => css`
    width: ${sizeMap[size]};
    height: 34px;

    flex-shrink: 0;

    &:not(:disabled) {
      cursor: pointer;
    }
  `}
`;
