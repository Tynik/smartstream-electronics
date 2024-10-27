import styled, { css, keyframes } from 'styled-components';
import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { HoneyBox } from '@react-hive/honey-layout';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

type LoadingProps = HoneyBoxProps & {
  size?: string;
  color?: string;
};

export const Loading = styled(HoneyBox)<LoadingProps>`
  ${({ size = '40px', theme: { colors } }) => css`
    display: inline-block;

    width: ${size};
    height: ${size};

    border: 4px solid ${colors.primary.dodgerBlue};
    border-top-color: transparent;
    border-radius: 50%;

    animation: ${spin} 1s linear infinite;
  `}
`;
