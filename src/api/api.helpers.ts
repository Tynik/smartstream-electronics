import { toast } from 'react-toastify';

import type { NetlifyRequestErrorResponse } from '~/api';

export const handlerApiError = (e: any) => {
  toast((e as NetlifyRequestErrorResponse).data.error, {
    type: 'error',
  });
};
