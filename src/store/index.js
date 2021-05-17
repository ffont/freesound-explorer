import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { default as fseReducer } from './mainReducer';

const generateStore = (initialState) => {
  if (process.env.NODE_ENV !== 'production') {
    const middleware = (window.__REDUX_DEVTOOLS_EXTENSION__) ?
      compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__()) :
      applyMiddleware(thunk);
    return createStore(
      fseReducer,
      initialState,
      middleware
    );
  }
  return createStore(
    fseReducer,
    initialState,
    applyMiddleware(thunk)
  );
};

export default function configureStore(initialState) {
  const store = generateStore(initialState);

  return store;
}
