import expect from 'expect';
import { truncateString } from './stringUtils';
import { range } from './arrayUtils';
import { DEFAULT_TRUNCATED_STRING_LENGTH } from '../constants';

describe('truncateString', () => {
  it('works as expected', () => {
    const longString = range(2000).map(() => 'a').join('');
    const extraChars = '...';
    const expectedString =
      longString.substr(0, DEFAULT_TRUNCATED_STRING_LENGTH - extraChars.length).concat(extraChars);
    expect(truncateString(longString, DEFAULT_TRUNCATED_STRING_LENGTH, extraChars))
      .toEqual(expectedString);
  });
});
