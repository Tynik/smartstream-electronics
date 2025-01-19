import { useEffect, useRef, useState } from 'react';

import type { Nullable } from '~/types';

import { useOnChange } from './use-on-change';

/**
 * A hook that manages the creation and revocation of an object URL for a given `Blob` or `MediaSource`.
 * It creates an object URL when the input object is provided, updates it when the input changes,
 * and revokes the previous URL asynchronously to free resources when the component unmounts or when the input changes.
 *
 * - The previous object URL is revoked asynchronously using `setTimeout` to ensure that it is safely revoked
 *   without interfering with ongoing use of the URL.
 * - When the component unmounts, the current object URL is also revoked to prevent memory leaks.
 *
 * @param {Nullable<Blob | MediaSource | undefined>} obj - The `Blob` or `MediaSource` for which to create an object URL.
 *
 * @returns {Nullable<string>} - The created object URL, or `null` if no object is provided or disabled.
 *
 * @example
 * ```tsx
 * const MediaViewer = ({ mediaFileData }) => {
 *   const objectUrl = useObjectUrl(mediaFileData);
 *
 *   return <img src={objectUrl} alt="Media" />;
 * };
 * ```
 */
export const useObjectUrl = (obj: Nullable<Blob | MediaSource> | undefined): Nullable<string> => {
  const [objectUrl, setObjectUrl] = useState<Nullable<string>>(() =>
    obj ? URL.createObjectURL(obj) : null,
  );

  const objectUrlRef = useRef<Nullable<string>>(objectUrl);
  objectUrlRef.current = objectUrl;

  const revokeUrl = (url: Nullable<string>) => {
    if (url) {
      // Revoke the URL asynchronously to avoid conflicts with its usage
      setTimeout(() => URL.revokeObjectURL(url), 0);
    }
  };

  useOnChange(obj, newObj => {
    const nextObjectUrl = newObj ? URL.createObjectURL(newObj) : null;

    setObjectUrl(nextObjectUrl);

    return () => {
      revokeUrl(nextObjectUrl);
    };
  });

  useEffect(() => {
    // Revoke the object URL on part unmount
    return () => {
      setObjectUrl(null);
      revokeUrl(objectUrlRef.current);
    };
  }, []);

  return objectUrl;
};
