import styled from 'styled-components';
import { HoneyFlexBox } from '@react-hive/honey-layout';

export const Panel = styled(HoneyFlexBox)``;

Panel.defaultProps = {
  $borderRadius: '4px',
  $border: '1px solid',
  $borderColor: 'neutral.grayLight',
  $boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};
