export const camelToDashCase = (inputString: string) =>
  inputString.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
