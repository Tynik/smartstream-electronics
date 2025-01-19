import type { ReactNode } from 'react';
import type { HoneyStatusContentOptions } from '@react-hive/honey-layout';
import React from 'react';
import { HoneyList } from '@react-hive/honey-layout';
import { noop } from '@react-hive/honey-form';

import type { PopupContentContext } from '~/components';
import type { SelectOption } from './Select.types';
import { Loading, Popup, Text, TextInput } from '~/components';
import { SelectOptionStyled } from './SelectOptionStyled';

type SelectChildrenContext<Option extends SelectOption, ValueKey extends keyof Option> = {
  value: Option[ValueKey] | undefined;
  toggleSelect: () => void;
};

export type SelectProps<
  Option extends SelectOption,
  ValueKey extends keyof Option = keyof Option,
> = Pick<HoneyStatusContentOptions, 'isLoading' | 'isError'> & {
  children?: (context: SelectChildrenContext<Option, ValueKey>) => ReactNode;
  value: Option | undefined;
  options: Option[] | undefined;
  idKey: keyof Option;
  valueKey: ValueKey;
  label: string;
  error?: ReactNode;
  onOpen?: () => void;
  onChange: (option: Option) => void;
};

export const Select = <Option extends SelectOption, ValueKey extends keyof Option>({
  children,
  value,
  options,
  idKey,
  valueKey,
  label,
  error,
  isLoading,
  isError,
  onOpen,
  onChange,
}: SelectProps<Option, ValueKey>) => {
  const handleSelectOption = ({ closePopup }: PopupContentContext, option: Option) => {
    closePopup();

    onChange?.(option);
  };

  return (
    <Popup
      content={contentContext => (
        <HoneyList
          items={options}
          itemKey={idKey}
          isLoading={isLoading}
          isError={isError}
          loadingContent={<Loading size="20px" lineWidth="2px" $margin="auto" />}
          errorContent={
            <Text variant="body2" $color="error.crimsonRed">
              Loading failed
            </Text>
          }
          $padding={1}
          $borderRadius="4px"
          $border="1px solid"
          $borderColor="secondary.softGray"
          $boxShadow="0px 4px 6px rgba(0,0,0,0.1)"
          $backgroundColor="white"
        >
          {option => (
            <SelectOptionStyled
              onClick={() => handleSelectOption(contentContext, option)}
              variant="body2"
              // ARIA
              aria-selected={value ? option[idKey] === value[idKey] : false}
            >
              {option[valueKey] as string}
            </SelectOptionStyled>
          )}
        </HoneyList>
      )}
      contentProps={{
        $width: '100%',
      }}
      onOpen={onOpen}
      // Data
      data-testid="select"
    >
      {({ togglePopup }) =>
        children?.({
          value: value?.[valueKey],
          toggleSelect: togglePopup,
        }) ?? (
          <TextInput
            value={(value?.[valueKey] as string) ?? ''}
            label={label}
            error={error}
            onClick={togglePopup}
            onChange={noop}
            placeholder="Select option"
          />
        )
      }
    </Popup>
  );
};
