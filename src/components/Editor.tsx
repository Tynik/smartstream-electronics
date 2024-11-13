import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

type EditorProps = {
  value: string | undefined;
  onChange: (value: string) => void;
};

export const Editor = ({ value, onChange }: EditorProps) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value || ''}
      onChange={(event, editor) => {
        onChange(editor.getData());
      }}
    />
  );
};
