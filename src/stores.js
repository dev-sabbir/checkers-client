import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware(rootSaga);
export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));