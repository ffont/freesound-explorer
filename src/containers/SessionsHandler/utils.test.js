import { reducersToExport } from './storableReducer';
import * as utils from './utils';
import { initialState as audioInitialState } from '../Audio/reducer';
import { initialState as loginInitialState } from '../Login/reducer';
import { initialState as mapInitialState } from '../Map/reducer';
import { initialState as messagesBoxInitialState } from '../MessagesBox/reducer';
import { initialState as metronomeInitialState } from '../Metronome/reducer';
import { initialState as midiInitialState } from '../Midi/reducer';
import { initialState as pathsInitialState } from '../Paths/reducer';
import { initialState as searchInitialState } from '../Search/reducer';
import { initialState as settingsInitialState } from '../Settings/reducer';
import { initialState as sidebarInitialState } from '../Sidebar/reducer';
import { initialState as soundsInitialState } from '../Sounds/reducer';
import { initialState as spacesInitialState } from '../Spaces/reducer';

const curState = {
  audio: audioInitialState,
  login: loginInitialState,
  map: mapInitialState,
  messagesBox: messagesBoxInitialState,
  metronome: metronomeInitialState,
  midi: midiInitialState,
  paths: pathsInitialState,
  search: searchInitialState,
  settings: settingsInitialState,
  sidebar: sidebarInitialState,
  sounds: soundsInitialState,
  spaces: spacesInitialState,
};

describe('getDataToSave', () => {
  const toSave = utils.getDataToSave(curState);
  it('return object to save has the right keys', () => {
    Object.keys(toSave).forEach(key =>
      expect(reducersToExport).toContain(key));
  });
});

describe('handleMapReducer', () => {
  const filteredData = utils.handleMapReducer(curState.map);
  it('omits forceMapUpdate', () => {
    expect(Object.keys(filteredData).includes('forceMapUpdate')).toEqual(false);
  });
});

describe('handleMetronomeReducer', () => {
  const filteredData = utils.handleMetronomeReducer(curState.metronome);
  it('omits shouldPlaySound', () => {
    expect(Object.keys(filteredData)).not.toContain('shouldPlaySound');
  });
  it('picks tempo', () => {
    expect(Object.keys(filteredData)).toContain('tempo');
  });
});

describe('handleMidiReducer', () => {
  const filteredData = utils.handleMidiReducer(curState.midi);
  it('picks notesMapped', () => {
    expect(Object.keys(filteredData).includes('notesMapped')).toEqual(true);
  });
  it('doesn\'t pick any other key', () => {
    expect(Object.keys(filteredData).length).toEqual(1);
  });
});

describe('handlePathsReducer', () => {
  const paths = { paths: [{ id: '1', name: 'a', soundCurrentlyPlaying: false }] };
  const filteredData = utils.handlePathsReducer(paths);
  it('correctly maps returns only paths key', () => {
    expect(Object.keys(filteredData).length).toEqual(1);
    expect(Object.keys(filteredData)[0]).toEqual('paths');
  });
  it('removes the key soundCurrentlyPlaying', () => {
    expect(Object.keys(filteredData.paths[0]).includes('soundCurrentlyPlaying')).toEqual(false);
    expect(Object.keys(filteredData.paths[0]).length).toEqual(2);
  });
});

describe('handleSessionReducer', () => {
  const session = { name: 'test', id: 'xxx', hasUnsavedProgress: true };
  it('correctly picks information to be saved', () => {
    expect(Object.keys(utils.handleSessionReducer(session))).toContain('name');
    expect(Object.keys(utils.handleSessionReducer(session))).toContain('id');
  });
  it('correctly doesn\'t include forbidden keys', () => {
    expect(Object.keys(utils.handleSessionReducer(session))).not.toContain('hasUnsavedProgress');
    expect(Object.keys(utils.handleSessionReducer(session))).not.toContain('availableUserSessions');
    expect(Object.keys(utils.handleSessionReducer(session))).not.toContain('availableDemoSessions');
  });
});

describe('handleSoundsReducer', () => {
  const sounds = {
    byID: { 's-1': { id: 's-1', user: 'xx', buffer: [], isHovered: true, isPlaying: true } },
    selectedSounds: ['s-2'],
    soundInfoModal: {},
  };
  const filteredData = utils.handleSoundsReducer(sounds);
  it('correctly maps returns only byID key', () => {
    expect(Object.keys(filteredData).length).toEqual(1);
    expect(Object.keys(filteredData)[0]).toEqual('byID');
  });
  it('removes the key forbidden keys', () => {
    const filteredSound = filteredData.byID['s-1'];
    expect(Object.keys(filteredSound).includes('buffer')).toEqual(false);
    expect(Object.keys(filteredSound).includes('isHovered')).toEqual(false);
    expect(Object.keys(filteredSound).includes('isPlaying')).toEqual(false);
    expect(Object.keys(filteredSound).length).toEqual(2);
  });
});

describe('spaces and settings', () => {
  it('are correctly handled', () => {
    expect(utils.filterDataForReducer(curState.spaces, 'spaces')).toEqual({ spaces: curState.spaces });
    expect(utils.filterDataForReducer(curState.settings, 'settings')).toEqual({ settings: curState.settings });
  });
});
