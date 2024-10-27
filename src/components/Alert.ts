import { HoneyBox } from '@react-hive/honey-layout';
import styled from 'styled-components';

export const Alert = styled(HoneyBox)``;

Alert.defaultProps = {
  $padding: 2,
  $borderRadius: '4px',
  $border: '1px solid',
  $borderColor: 'error.redLight',
  $backgroundColor: 'error.pinkLight',
};
