import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { default as fseReducer } from '../reducers';

export default function configureStore(initialState) {
  const store = createStore(
    fseReducer,
    initialState,
    applyMiddleware(thunk, createLogger())
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      store.replaceReducer(fseReducer);
    });
  }

  return store;
}
