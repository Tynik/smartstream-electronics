import React, { useRef } from 'react';
import type {
  ChangeEventHandler,
  HTMLAttributes,
  InputHTMLAttributes,
  PropsWithChildren,
} from 'react';
import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { HoneyBox } from '@react-hive/honey-layout';
import styled from 'styled-components';

import type { Nullable } from '~/types';
import { convertFileListToFiles } from '~/helpers';

type SelectFilesWrapperStyledProps = HTMLAttributes<HTMLLabelElement> & HoneyBoxProps;

const SelectFilesWrapperStyled = styled(HoneyBox).attrs({
  as: 'label',
})<SelectFilesWrapperStyledProps>`
  cursor: pointer;

  input {
    display: none;
  }
`;

export type SelectFilesWrapperProps = SelectFilesWrapperStyledProps & {
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  onSelectFiles: (files: File[]) => void;
};

export const SelectFilesWrapper = ({
  children,
  onSelectFiles,
  inputProps,
  ...props
}: PropsWithChildren<SelectFilesWrapperProps>) => {
  const selectFilesInputRef = useRef<Nullable<HTMLInputElement>>(null);

  const selectFilesHandler: ChangeEventHandler<HTMLInputElement> = e => {
    onSelectFiles(convertFileListToFiles(e.target.files));

    if (selectFilesInputRef.current) {
      selectFilesInputRef.current.value = '';
    }
  };

  return (
    <SelectFilesWrapperStyled
      htmlFor="select-files-input"
      tabIndex={0}
      // ARIA
      aria-label="Select files"
      {...props}
    >
      <input
        ref={selectFilesInputRef}
        id="select-files-input"
        type="file"
        title=""
        tabIndex={-1}
        onChange={selectFilesHandler}
        multiple
        {...inputProps}
      />

      {children}
    </SelectFilesWrapperStyled>
  );
};
