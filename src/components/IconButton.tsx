import styled, { css } from 'styled-components';
import { HoneyBox } from '@react-hive/honey-layout';

export const IconButton = styled(HoneyBox).attrs({
  as: 'button',
})`
  ${({ theme: { colors } }) => css`
    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    border: none;
    border-radius: 4px;
    background-color: unset;

    &:hover {
      background-color: ${colors.secondary.extraLightGray};
    }
  `}
`;

IconButton.defaultProps = {
  $padding: 0.5,
};
