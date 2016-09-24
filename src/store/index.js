import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { default as fseReducer } from './mainReducer';

const generateStore = (initialState) => {
  if (process.env.NODE_ENV !== 'production') {
    return createStore(
      fseReducer,
      initialState,
      compose(
        applyMiddleware(thunk),
        window.devToolsExtension && window.devToolsExtension()
      )
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
