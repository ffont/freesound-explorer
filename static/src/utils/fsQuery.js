import { DEFAULT_FILTER, DEFAULT_QUERY } from '../constants';
import freesound from '../vendors/freesound';
import { rgbToHex } from './colors';

function getRequestParameter(name, queryUrl = location.search) {
  const parsedRegex = (new RegExp(
    `[?&]${encodeURIComponent(name)}=([^&]*)`)
  ).exec(queryUrl);
  return decodeURIComponent(parsedRegex[1]);
}

function parseFreesoundSearchUrl(url) {
  const query = getRequestParameter('q', url);
  const filter = getRequestParameter('f', url);
  return { query, filter };
}

function search(query = DEFAULT_QUERY, filter = DEFAULT_FILTER) {
  // Search sounds and start loading them
  let pageCounter = 0;
  const pagesToGet = 2;
  const extraDescriptors = [
    'lowlevel.mfcc.mean',
    'lowlevel.barkbands.mean',
    'lowlevel.erb_bands.mean',
    'lowlevel.frequency_bands.mean',
    'lowlevel.gfcc.mean',
    'sfx.tristimulus.mean',
    'tonal.hpcp.mean',
    'lowlevel.spectral_contrast.mean',
    'lowlevel.scvalleys.mean',
  ];
  const promises = [];
  while (pageCounter < pagesToGet) {
    freesound.setToken(sessionStorage.getItem('app_token'));
    promises.push(freesound.textSearch(query, {
      page: pageCounter + 1,
      page_size: 150,
      group_by_pack: 0,
      filter,
      fields: 'id,previews,name,analysis,url,username',
      descriptors: extraDescriptors.join(),
    }));
    pageCounter++;
  }
  return Promise.all(promises);
}

export function submitQuery(submittedQuery) {
  if ((submittedQuery.startsWith('http')) && (submittedQuery.indexOf('freesound.org') !== -1)) {
    // Freesound url, parse query and filter and search
    const { query, filter } = parseFreesoundSearchUrl(submittedQuery);
    return search(query, filter);
  }
  // normal query
  return search(submittedQuery);
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
