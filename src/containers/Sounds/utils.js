import { MAP_SCALE_FACTOR, TSNE_CONFIG, DEFAULT_DESCRIPTOR }
  from 'constants';
import { readObjectPropertyByPropertyAbsName } from 'utils/objectUtils';
import tsnejs from 'vendors/tsne';
import sassVariables from 'stylesheets/variables.json';


export const computeSoundGlobalPosition = (tsnePosition, spacePosition, mapPosition) => {
  if (tsnePosition === undefined) {
    return { cx: 0.0, cy: 0.0 };
  }
  const { translateX, translateY, scale } = mapPosition;
  const cx = ((tsnePosition.x + (window.innerWidth / (MAP_SCALE_FACTOR * 2))) *
    MAP_SCALE_FACTOR * scale * spacePosition.x) + translateX;
  const cy = ((tsnePosition.y + (window.innerHeight / (MAP_SCALE_FACTOR * 2))) *
    MAP_SCALE_FACTOR * scale * spacePosition.y) + translateY;
  return { cx, cy };
};

export const thumbnailMapPosition = { translateX: 0, translateY: 0, scale: 0.3 };
export const thumbnailSize = () => {
  const { sidebarWidth, sidebarClosedOffset, sidebarContentPadding, thumbnailHeight }
    = sassVariables;
  return {
    width: parseInt(sidebarWidth, 10) - parseInt(sidebarClosedOffset, 10) -
    (2 * (parseInt(sidebarContentPadding, 10))),
    height: parseInt(thumbnailHeight, 10),
  };
};

export const getTrainedTsne = (sounds, queryParams) => {
  const tsne = new tsnejs.Tsne(TSNE_CONFIG);
  const descriptor = queryParams.descriptor || DEFAULT_DESCRIPTOR;
  const descriptorKey = `analysis.${descriptor}`;
  const trainingData = Object.keys(sounds).map(
    soundID => readObjectPropertyByPropertyAbsName(sounds[soundID], descriptorKey));
  tsne.initDataRaw(trainingData);
  return tsne;
};

const getSoundSpacePosition = (sound, store) => {
  const { spaces } = store.spaces;
  // find the space to which sound belongs to
  const space = spaces.find(curSpace => curSpace.queryID === sound.queryID);
  return space.position;
};

export const computePointsPositionInSolution = (tsne, sounds, store) => {
  const tsneSolution = tsne.getSolution();
  return Object.keys(sounds).reduce((curState, curSoundID, curIndex) => {
    const sound = sounds[curSoundID];
    const mapPosition = store.map;
    let { spacePosition } = sound;
    if (!spacePosition) {
      spacePosition = getSoundSpacePosition(sound, store);
    }
    const tsnePosition = {
      x: tsneSolution[curIndex][0],
      y: tsneSolution[curIndex][1],
    };
    const position = computeSoundGlobalPosition(tsnePosition, spacePosition, mapPosition);
    return Object.assign({}, curState, {
      [curSoundID]: {
        position,
        spacePosition, // tsne and spacePosition could be useful later (e.g.: when user moves map)
        tsnePosition,
      },
    });
  }, {});
};

export const isSoundInsideScreen = (position, isThumbnail = false) => {
  if (!position) {
    return false;
  }
  const thumbSize = thumbnailSize();
  const circleDiameter = parseInt(sassVariables.mapCircles.defaultRadius, 10) * 2;
  const screenWidth = (isThumbnail) ? thumbSize.width : window.innerWidth;
  const screenHeight = (isThumbnail) ? thumbSize.height : window.innerHeight;
  const isVerticallyOutOfScreen = (position.cy < -circleDiameter
    || position.cy > screenHeight + circleDiameter);
  const isHorizontallyOutOfScreen = (position.cx < -circleDiameter
    || position.cx > screenWidth + circleDiameter);
  return !(isVerticallyOutOfScreen || isHorizontallyOutOfScreen);
};

export const reshapeSoundListData = (sounds, selectedSounds) => {
  const data = [];

  // only list sounds of current selected space
  Object.keys(sounds)
    .forEach((id) => {
      // copy sound here, so redux state remains uncanged!
      const { license, tags, name, username, duration, isPlaying, isHovered, color } = sounds[id];
      const sound = { id, license, tags, name, username, duration, isPlaying, isHovered, color };
      // format data fields
      if (sound.duration) {
        sound.durationfixed = sound.duration.toFixed(2);
      }
      if (sound.license) {
        switch (sound.license) {
          case 'http://creativecommons.org/licenses/by/3.0/':
            sound.shortLicense = 'CC BY 3.0';
            break;
          case 'http://creativecommons.org/publicdomain/zero/1.0/':
            sound.shortLicense = 'CC0 1.0';
            break;
          case 'http://creativecommons.org/licenses/by-nc/3.0/':
            sound.shortLicense = 'CC BY-NC 3.0';
            break;
          case 'http://creativecommons.org/licenses/by-nc/4.0/':
            sound.shortLicense = 'CC BY-NC 4.0';
            break;
          case 'http://creativecommons.org/licenses/sampling+/1.0/':
            sound.shortLicense = 'Sampling Plus 1.0';
            break;
          case 'http://creativecommons.org/licenses/by-sa/4.0/':
            sound.shortLicense = 'CC BY-SA 4.0';
            break;
          case 'http://creativecommons.org/licenses/by-nd/4.0/':
            sound.shortLicense = 'CC BY-ND 4.0';
            break;
          default:
            sound.shortLicense = 'not specified!';
        }
      }
      if (sound.tags) {
        // sort array lexically, ignoring case
        sound.tagsStr = sound.tags.sort((a, b) => {
          if (a.toUpperCase() < b.toUpperCase()) {
            return -1;
          }
          return 1;
        }).join(', ');
      }
      sound.isSelected = selectedSounds.includes(sound.id);
      data.push(sound);
    });
  return data;
};
