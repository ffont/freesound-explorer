import { UPDATE_SESSION_NAME, SET_SESSION_ID } from './actions';
import storable from '../SessionsHandler/storableReducer';

export const initialState = {
  author: '',
  name: '',
  id: '',
  date: {},
};

const author = (state = initialState.author, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const name = (state = initialState.name, action) => {
  switch (action.type) {
    case UPDATE_SESSION_NAME:
      return action.name;
    default:
      return state;
  }
};

const sessionID = (state = initialState.id, action) => {
  switch (action.type) {
    case SET_SESSION_ID:
      return action.id;
    default:
      return state;
  }
};

const date = (state = initialState.date, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const session = (state = initialState, action) => ({
  author: author(state.author, action),
  name: name(state.name, action),
  id: sessionID(state.id, action),
  date: date(state.date, action),
});

export default storable(session);
