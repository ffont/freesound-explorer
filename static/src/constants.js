export const DEFAULT_QUERY = 'instrument note';
export const DEFAULT_MAX_RESULTS = 60;
export const DEFAULT_MIN_DURATION = 0;
export const DEFAULT_MAX_DURATION = 5;
export const DEFAULT_DESCRIPTOR = 'lowlevel.mfcc.mean';

export const DEFAULT_MESSAGE_DURATION = 4000;
export const MESSAGE_STATUS = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
  PROGRESS: 'progress',
};

export const SIDEBAR_TABS = {
  SEARCH: 'search',
  PATHS: 'paths',
  INFO: 'info',
  SPACES: 'spaces',
  SETTINGS: 'settings',
};

export const DEFAULT_SIDEBAR_TAB = SIDEBAR_TABS.SEARCH;

export const REQUEST_POOL_SIZE = 50;

export const MIN_ZOOM = 0.2;
export const MAX_ZOOM = 15;
export const MAP_SCALE_FACTOR = 20;
export const DEFAULT_RADIUS = 30;
export const DEFAULT_STROKE_WIDTH = 2;
export const DEFAULT_FILL_OPACITY = 0.7;
export const DEFAULT_STROKE_OPACITY = 0.9;
export const DEFAULT_PATH_STROKE_WIDTH = 2;
export const DEFAULT_PATH_STROKE_OPACITY = 0.05;

export const MAX_TSNE_ITERATIONS = 250;
export const TSNE_CONFIG = {
  epsilon: 10,
  perplexity: 10,
  dim: 2,
};

export const DEFAULT_TEMPO = 120.0;
export const LOOKAHEAD = 25; // How often we'll call the scheduler function (in milliseconds)
export const SCHEDULEAHEADTIME = 0.2; // How far we schedule notes from lookahead call (in seconds)
export const TICKRESOLUTION = 16; // 16 for 16th note or 32 for 32th note
