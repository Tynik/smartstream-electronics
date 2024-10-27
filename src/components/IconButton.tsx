import styled from 'styled-components';
import { HoneyBox } from '@react-hive/honey-layout';

export const IconButton = styled(HoneyBox).attrs({
  as: 'button',
})`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 32px;

  cursor: pointer;

  border: none;
  border-radius: 4px;
  background-color: unset;

  &:hover {
    background-color: #333333;
  }
`;
