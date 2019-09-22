import { takeLatest } from 'redux-saga/effects';

export function* initSaga() {

}

export default function* watcherSaga() {
    yield takeLatest('INIT_ACTION', initSaga)
}