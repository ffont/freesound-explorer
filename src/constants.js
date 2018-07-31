// local files for offline development
export const USE_LOCAL_FONTAWESOME = false;

// search
export const DEFAULT_QUERY = 'instruments';
export const DEFAULT_MAX_RESULTS = 60;
export const DEFAULT_MIN_DURATION = 0;
export const DEFAULT_MAX_DURATION = 5;
export const DEFAULT_DESCRIPTOR = 'lowlevel.mfcc.mean';
export const DEFAULT_SORTING = 'score';
export const PERFORM_QUERY_AT_MOUNT = false;

// backend and login urls
const BACKEND_APPLICATION_ROOT = '/fse'; // must match with backend's application root
export const URLS = {
  SAVE_SESSION: `${BACKEND_APPLICATION_ROOT}/save/`,
  LOAD_SESSION: `${BACKEND_APPLICATION_ROOT}/load/`,
  REMOVE_SESSION: `${BACKEND_APPLICATION_ROOT}/delete/`,
  AVAILABLE_SESSIONS: `${BACKEND_APPLICATION_ROOT}/available/`,
  DELETE_SESSION: `${BACKEND_APPLICATION_ROOT}/delete/`,
  LOGIN: `${BACKEND_APPLICATION_ROOT}/login/freesound/`,
  LOGOUT: `${BACKEND_APPLICATION_ROOT}/logout/`,
  PREPARE_AUTH: `${BACKEND_APPLICATION_ROOT}/prepare_auth/`,
  GET_APP_TOKEN: `${BACKEND_APPLICATION_ROOT}/get_app_token/`,
};

// messagesBox
export const DEFAULT_MESSAGE_DURATION = 4000;
export const MESSAGE_STATUS = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
  PROGRESS: 'progress',
};

// sidebar
export const SIDEBAR_TABS = {
  SEARCH: 'search',
  SPACES: 'spaces',
  SOUNDLIST: 'soundlist',
  PATHS: 'paths',
  MIDI: 'midi',
  HOME: 'home',
  INFO: 'info',
};
export const DEFAULT_SIDEBAR_TAB = SIDEBAR_TABS.SEARCH;

// modal
export const MODAL_PAGES = {
  NEW_SESSION: 'newSession',
  SAVE_SESSION: 'saveSession',
  LOAD_SESSION: 'loadSession',
  ERROR: 'error',
};

// requests
export const REQUEST_POOL_SIZE = 50;

// midi
export const N_MIDI_MESSAGES_TO_KEEP = 10;
export const MIDI_MESSAGE_INDICATOR_DURATION = 1000;

// map
export const MIN_ZOOM = 0.05;
export const MAX_ZOOM = 15;
export const MAP_SCALE_FACTOR = 20;
export const TOGGLE_MULTISELECTION_KEYCODE = 16; // shift key
export const PLAY_ON_HOVER_SHORTCUT_KEYCODE = 18; // alt key
export const TOGGLE_SHOW_CLUSTER_TAGS_KEYCODE = 84; // t
export const CANCEL_KEYCODE = 27; // esc
// tsne
export const MAX_TSNE_ITERATIONS = 150;
export const TSNE_CONFIG = {
  epsilon: 10,
  perplexity: 10,
  dim: 2,
};

// string utils
export const DEFAULT_TRUNCATED_STRING_LENGTH = 40;

// metronome and syncing
export const START_METRONOME_AT_MOUNT = false;
export const DEFAULT_TEMPO = 120.0;
export const LOOKAHEAD = 25; // How often we'll call the scheduler function (in milliseconds)
export const SCHEDULEAHEADTIME = 0.2; // How far we schedule notes from lookahead call (in seconds)
export const TICKRESOLUTION = 16; // 16 for 16th note or 32 for 32th note

// clustering / rescans until constants are given
export const MIN_ITEMS_PER_CLUSTER = 4;
export const MIN_CLUSTERS_PER_SCAN = 3;
export const MAX_CLUSTERS_PER_SCAN = 8;
export const MIN_CLUSTERS_RATIO = 0.07;
export const MAX_CLUSTERS_RATIO = 0.166; // max one cluster per 6 Sounds = 1/6
