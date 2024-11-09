import type { Nullable } from '~/types';

/**
 * Converts a `FileList` object to an array of `File` objects.
 *
 * @param {Nullable<FileList>} fileList - The `FileList` object to convert.
 *
 * @returns {File[]} An array of `File` objects.
 */
export const convertFileListToFiles = (fileList: Nullable<FileList>): File[] => {
  if (!fileList) {
    return [];
  }

  const files: File[] = [];

  for (let i = 0; i < fileList.length; i++) {
    files.push(fileList[i]);
  }

  return files;
};
