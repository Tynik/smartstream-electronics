export * from './react.helpers';
export * from './network.helpers';
export * from './file.helpers';

export function assert(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
