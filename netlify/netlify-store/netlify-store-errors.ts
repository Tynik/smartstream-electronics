import { NetlifyError } from '../netlify-errors';

export class NetlifyStoreConstraintError extends NetlifyError {
  public details: { status: string; statusCode: number; data: { error: string } };

  constructor(details: { status: string; statusCode: number; data: { error: string } }) {
    super(details.data.error);

    this.details = details;
    this.name = 'NetlifyStoreConstraintError';
  }
}
