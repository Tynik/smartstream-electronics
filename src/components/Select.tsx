import React, { useState } from 'react';
import { flip, shift, useFloating } from '@floating-ui/react-dom';
import { HoneyBox, HoneyList } from '@react-hive/honey-layout';
import { noop } from '@react-hive/honey-form';
import styled, { css } from 'styled-components';

import { TextInput } from '~/components';

const SelectOptionStyled = styled(HoneyBox)`
  ${({ theme: { colors } }) => css`
    cursor: pointer;

    &:hover {
      background-color: ${colors.secondary.extraLightGray};
    }
  `}
`;

SelectOptionStyled.defaultProps = {
  $padding: 1,
};

type SelectOption = object;

export type SelectProps<Option extends SelectOption> = {
  value: Option | undefined;
  options: Option[] | undefined;
  idKey?: keyof Option;
  valueKey?: keyof Option;
  label: string;
  onChange: (option: Option) => void;
};

export const Select = <Option extends SelectOption>({
  value,
  options,
  idKey = 'id' as keyof Option,
  valueKey = 'name' as keyof Option,
  label,
  onChange,
}: SelectProps<Option>) => {
  const [isOpen, setIsOpen] = useState(false);

  const { x, y, strategy, refs } = useFloating({
    placement: 'bottom',
    middleware: [shift({ padding: 16 }), flip()],
  });

  const handleSelectOption = (option: Option) => {
    setIsOpen(false);

    onChange?.(option);
  };

  return (
    <HoneyBox ref={refs.setReference} $position="relative" $width="100%">
      <TextInput
        value={(value?.[valueKey] as string) ?? ''}
        label={label}
        onClick={() => setIsOpen(!isOpen)}
        onChange={noop}
        placeholder="Select option"
      />

      {isOpen && (
        <HoneyList
          ref={refs.setFloating}
          items={options}
          $position={strategy}
          $width="100%"
          $top={x}
          $left={y}
          $padding={1}
          $borderRadius="4px"
          $border="1px solid"
          $borderColor="secondary.softGray"
          $boxShadow="0px 4px 6px rgba(0,0,0,0.1)"
          $backgroundColor="white"
        >
          {option => (
            <SelectOptionStyled onClick={() => handleSelectOption(option)}>
              {option[valueKey] as string}
            </SelectOptionStyled>
          )}
        </HoneyList>
      )}
    </HoneyBox>
  );
};
