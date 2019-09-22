import { all } from 'redux-saga/effects'
import watcherSaga from './containers/GameBoard/saga';
export default function* rootSaga() {
    yield all([
        watcherSaga,
    ])
}