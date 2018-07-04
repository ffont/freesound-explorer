import { TOGGLE_PLAY_ON_HOVER, TOGGLE_METRONOME_SOUND,
  SET_SHOULD_PLAY_ON_HOVER, TOGGLE_CLUSTER_TAGS, TOGGLE_MULTISELECTION, SET_SHORTCUT_ANIMATION } from './actions';
import storable from '../SessionsHandler/storableReducer';
import { FETCH_SOUNDS_REQUEST } from '../Sounds/actions';

export const initialState = {
  shouldPlayOnHover: false,
  shouldPlayMetronomeSound: false,
  shouldShowClusterTags: true,
  shortcutAnimation: false,
};

const settings = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SOUNDS_REQUEST: {
      return Object.assign({}, state, {
        shortcutAnimation: false,
      });
    }
    case SET_SHORTCUT_ANIMATION: {
      return Object.assign({}, state, {
        shortcutAnimation: action.showAnimation,
      });
    }
    case TOGGLE_PLAY_ON_HOVER: {
      return Object.assign({}, state, {
        shouldPlayOnHover: !state.shouldPlayOnHover,
      });
    }
    case SET_SHOULD_PLAY_ON_HOVER: {
      return Object.assign({}, state, {
        shouldPlayOnHover: action.shouldPlayOnHover,
      });
    }
    case TOGGLE_METRONOME_SOUND: {
      return Object.assign({}, state, {
        shouldPlayMetronomeSound: !state.shouldPlayMetronomeSound,
      });
    }
    case TOGGLE_CLUSTER_TAGS: {
      return Object.assign({}, state, {
        shouldShowClusterTags: !state.shouldShowClusterTags,
      });
    }
    case TOGGLE_MULTISELECTION: {
      return Object.assign({}, state, {
        shouldMultiSelect: action.shouldMultiSelect,
      })
    }
    default:
      return state;
  }
};

export default storable(settings);
