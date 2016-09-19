import { DEFAULT_TRUNCATED_STRING_LENGTH } from '../constants';

export const truncateString = (string, length = DEFAULT_TRUNCATED_STRING_LENGTH, extraChars = '...') => {
  const maxLength = DEFAULT_TRUNCATED_STRING_LENGTH - extraChars.length;
  if (string.length <= maxLength) {
    return string;
  }
  return string.substr(0, maxLength).concat(extraChars);
};
