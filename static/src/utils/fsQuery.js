import { DEFAULT_QUERY, DEFAULT_MAX_RESULTS } from '../constants';
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

function search(query = DEFAULT_QUERY, filter = '', maxResults = DEFAULT_MAX_RESULTS) {
  // Search sounds and start loading them
  let pageCounter = 0;
  const freesoundMaxPageSize = 150;
  const pagesToGet = Math.ceil(maxResults / freesoundMaxPageSize);
  const extraDescriptors = [
    'lowlevel.mfcc.mean',
    'sfx.tristimulus.mean',
    'tonal.hpcp.mean',
  ];
  const promises = [];
  while (pageCounter < pagesToGet) {
    const maxPageResults = (pageCounter + 1 !== pagesToGet) ?
      Math.min(maxResults, freesoundMaxPageSize) :
      maxResults - (pageCounter * freesoundMaxPageSize);
    freesound.setToken(sessionStorage.getItem('app_token'));
    promises.push(freesound.textSearch(query, {
      page: pageCounter + 1,
      page_size: maxPageResults,
      group_by_pack: 0,
      filter,
      fields: 'id,previews,name,analysis,url,username,duration',
      descriptors: extraDescriptors.join(),
    }));
    pageCounter++;
  }
  return Promise.all(promises);
}

export function submitQuery(submittedQuery, maxResults, maxDuration) {
  let query;
  let filter = '';
  if ((submittedQuery.startsWith('http')) && (submittedQuery.indexOf('freesound.org') !== -1)) {
    // Freesound url, parse query and filter and search
    const { query2, filter2 } = parseFreesoundSearchUrl(submittedQuery);
    query = query2;
    filter = filter2;
  } else {
    // Standard query
    const parsedMaxDuration = parseInt(maxDuration, 10);
    filter = `duration:[0%20TO%20${parsedMaxDuration}]`;
    query = submittedQuery;
  }
  return search(query, filter, maxResults);
}

const reshapePageResults = (pageResults, queryID) => {
  const results = pageResults.results;
  return results.reduce((curState, curSound, curIndex) => {
    const { analysis, url, name, username, duration } = curSound;
    const id = `${curSound.id}-${queryID}`;
    const previewUrl = curSound.previews['preview-lq-mp3'];
    const fsObject = pageResults.getSound(curIndex);
    const { bookmark, download } = fsObject;
    // TODO: check whether the sound is actually bookmarked
    const isBookmarked = false;
    const buffer = undefined;
    // consider only sounds with non-empty analysis
    if (analysis) {
      const color = rgbToHex(
        Math.floor(255 * analysis.sfx.tristimulus.mean[0]),
        Math.floor(255 * analysis.sfx.tristimulus.mean[1]),
        Math.floor(255 * analysis.sfx.tristimulus.mean[2])
      );
      Object.assign(curState, {
        [id]: {
          id,
          queryID,
          previewUrl,
          analysis,
          url,
          name,
          color,
          username,
          duration, // Will be updated once sound is loaded to buffer
          bookmark,
          download,
          isBookmarked,
          buffer,
          isPlaying: false,
          isHovered: false,
        },
      });
    }
    return curState;
  }, {});
};

export function reshapeReceivedSounds(allPagesResults, queryID) {
  let receivedSounds = {};
  allPagesResults.forEach(pageResults => {
    const reshapedPageResults = reshapePageResults(pageResults, queryID);
    receivedSounds = Object.assign({}, receivedSounds, reshapedPageResults);
  });
  return receivedSounds;
}
