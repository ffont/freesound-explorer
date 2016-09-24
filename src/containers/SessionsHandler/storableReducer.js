import { NEW_SESSION, LOAD_SESSION } from './actions';

export const reducersToExport = [];

/**
 * Higher order reducer that automatically handles the actions NEW_SESSION
 * and LOAD_SESSION for the reducers that extend it.
 * The action NEW_SESSION will lead each extended reducer to return to its
 *  original state.
 * The action LOAD_SESSION will lead to replace the current state of the reducer
 *  with the passed one.
 * N.B. As saving and loading session relies on the name of the property in the
 *  state, it's fundamental for each extended exported reducer to have the same
 *  name of the corresponding property in the state. For instance, don't call
 *  this function on a reducer obtained with combineReducers as that function
 *  will override the name of the exported reducer.
 */

export default (reducer) => {
  /* N.B. as we are using reducer.name, it's fundamental for the exported reducer to
  have the same name of the corresponding property in the state */
  reducersToExport.push(reducer.name);

  // the actual enriched reducer
  return (state, action) => {
    switch (action.type) {
      case NEW_SESSION: {
        // this will lead the reducer to reset to its initial state
        return reducer(undefined, {});
      }
      case LOAD_SESSION: {
        const loadedState = action[reducer.name];
        const resetAction = {};
        /* as resetAction.type is undefined, each reducer will just reach default case
          and return its first parameter (in this case loadedState).
          This way each reducer will replace its state with loadedState */
        return reducer(loadedState, resetAction);
      }
      default:
        // the normal call to the reducer
        return reducer(state, action);
    }
  };
};
