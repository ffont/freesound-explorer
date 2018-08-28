import makeActionCreator from 'utils/makeActionCreator';

export const TOGGLE_PLAY_ON_HOVER = 'TOGGLE_PLAY_ON_HOVER';
export const SET_SHOULD_PLAY_ON_HOVER = 'SET_SHOULD_PLAY_ON_HOVER';
export const TOGGLE_METRONOME_SOUND = 'TOGGLE_METRONOME_SOUND';
export const TOGGLE_CLUSTER_TAGS = 'TOGGLE_CLUSTER_TAGS';
export const TOGGLE_MULTISELECTION = 'TOGGLE_MULTISELECTION';
export const SET_SHORTCUT_ANIMATION = 'SET_SHORTCUT_ANIMATION';

export const togglePlayOnHover = makeActionCreator(TOGGLE_PLAY_ON_HOVER);
export const setShouldPlayOnHover = makeActionCreator(SET_SHOULD_PLAY_ON_HOVER, 'shouldPlayOnHover');
export const toggleMetronomeSound = makeActionCreator(TOGGLE_METRONOME_SOUND);
export const toggleClusterTags = makeActionCreator(TOGGLE_CLUSTER_TAGS);
export const toggleMultiSelection = makeActionCreator(TOGGLE_MULTISELECTION, 'shouldMultiSelect');
export const setShortcutAnimation = makeActionCreator(SET_SHORTCUT_ANIMATION, 'shortcutAnimation');
