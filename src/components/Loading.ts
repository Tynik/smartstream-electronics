import type { HTMLAttributes } from 'react';
import type { HoneyCSSDimensionValue, HoneyBoxProps } from '@react-hive/honey-layout';
import { HoneyBox } from '@react-hive/honey-layout';
import styled, { css, keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

type LoadingProps = HTMLAttributes<HTMLDivElement> &
  HoneyBoxProps & {
    size?: HoneyCSSDimensionValue;
    lineWidth?: HoneyCSSDimensionValue;
    color?: string;
  };

export const Loading = styled(HoneyBox)<LoadingProps>`
  ${({ size = '40px', lineWidth = '4px', theme: { colors } }) => css`
    display: inline-block;

    width: ${size};
    height: ${size};

    border: ${lineWidth} solid ${colors.primary.dodgerBlue};
    border-top-color: transparent;
    border-radius: 50%;

    animation: ${spin} 1s linear infinite;
  `}
`;
