/**
 * Utility function to convert a string to sentence case.
 * @param str The string to convert
 * @returns The string in sentence case
 */
export const toSentenceCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
