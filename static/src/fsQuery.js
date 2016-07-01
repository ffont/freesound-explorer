import { parseFreesoundSearchUrl } from './utils/freesoundUtils';
import { DEFAULT_FILTER, DEFAULT_QUERY } from './constants';
import freesound from './vendors/freesound';
import { rgbToHex } from './utils/colors';

function newSearch(query = DEFAULT_QUERY, filter = DEFAULT_FILTER) {
  // Search sounds and start loading them
  let pageCounter = 0;
  const pageToScrobble = 2;
  const extraDescriptors = 'lowlevel.mfcc.mean';
  const promises = [];
  while (pageCounter < pageToScrobble) {
    freesound.setToken(sessionStorage.getItem('app_token'));
    promises.push(freesound.textSearch(query, {
      page: pageCounter + 1,
      page_size: 150,
      group_by_pack: 0,
      filter,
      fields: 'id,previews,name,analysis,url,username',
      descriptors: `sfx.tristimulus.mean,${extraDescriptors}`,
    }));
    pageCounter++;
  }
  return Promise.all(promises);
}

export function submitQuery(submittedQuery) {
  if ((submittedQuery.startsWith('http')) && (submittedQuery.indexOf('freesound.org') !== -1)) {
    // Freesound url, parse query and filter and search
    const { query, filter } = parseFreesoundSearchUrl(submittedQuery);
    return newSearch(query, filter);
  }
  // normal query
  return newSearch(submittedQuery);
}

export function reshapeReceivedSounds(allPagesResults) {
  const receivedSounds = [];
  allPagesResults.forEach(pageResults => {
    const results = pageResults.results;
    results.forEach((sound, index) => {
      const { id, analysis, url, name, username } = sound;
      const previewUrl = sound.previews['preview-lq-mp3'];
      const fsObject = pageResults.getSound(index);
      // consider only sounds with non-empty analysis
      if (!!analysis) {
        const rgba = rgbToHex(
          Math.floor(255 * analysis.sfx.tristimulus.mean[0]),
          Math.floor(255 * analysis.sfx.tristimulus.mean[1]),
          Math.floor(255 * analysis.sfx.tristimulus.mean[2])
        );
        receivedSounds.push({
          id,
          previewUrl,
          analysis,
          url,
          name,
          rgba,
          username,
          fsObject,
        });
      }
    });
  });
  return receivedSounds;
}
