import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import reducers from './reducers';

export const history = createBrowserHistory();

function configureStore() {
  return createStore(
    reducers,
    applyMiddleware(
      thunk,
      routerMiddleware(history)
    )
  );
}

export const store = configureStore();
