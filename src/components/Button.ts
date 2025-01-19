import type { ButtonHTMLAttributes } from 'react';
import type { HoneyBoxProps, HoneyCSSDimensionValue } from '@react-hive/honey-layout';
import { HoneyBox } from '@react-hive/honey-layout';
import styled, { css } from 'styled-components';

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

export const Button = styled(HoneyBox).attrs<ButtonProps>(({ type, as }) => ({
  as: as ?? 'button',
  type: type ?? 'button',
}))<ButtonProps>`
  ${({ size = 'medium', theme: { colors } }) => css`
    display: flex;
    align-items: center;
    justify-content: center;

    width: ${sizeMap[size]};
    height: 34px;

    flex-shrink: 0;

    border-radius: 4px;
    border: 1px solid ${colors.secondary.mediumLightGray};

    &:not(:disabled) {
      cursor: pointer;
    }
  `}
`;
