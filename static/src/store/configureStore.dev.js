import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import ReduxDevTools from '../components/ReduxDevTools';
import { default as fseReducer } from '../reducers';

export default function configureStore(initialState) {
  const store = createStore(
    fseReducer,
    initialState,
    compose(
      applyMiddleware(thunk, createLogger()),
      ReduxDevTools.instrument()
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      store.replaceReducer(fseReducer);
    });
  }

  return store;
}
