import { toast } from 'react-toastify';

import type { NetlifyRequestErrorResponse } from '~/api';

export const handlerApiError = (e: any) => {
  if ('data' in e) {
    return toast((e as NetlifyRequestErrorResponse).data.error, {
      type: 'error',
    });
  }

  console.error(e);

  return toast('Something went wrong', {
    type: 'error',
  });
};
