import { Get, Put }  from 'lib/Request'
import { put, call, select } from 'redux-saga/effects'

export const getPageConfig = ({ types }) => function* () {
  try {
    yield put({ type: types.FETCH_PENDING })

    const { data } = yield call(Get, '/page_home')

    yield put({
      payload: data,
      type   : types.FETCH_FULFILLED
    })
  } catch (e) {
    const { type, message, response: { data: { message: messageResponse } = {} } = {} } = e
    switch (type) {
      case 'cancel':
        yield put({ type: types.FETCH_CANCEL })
        break
      default:
        yield put({
          error: messageResponse || message,
          type : types.FETCH_FAILURE
        })
        break
    }
  }
}

export const updatePageConfig = ({ types, selectors }) => function* () {
  try {
    yield put({ type: types.PUT_PENDING })
    const getAllCheckbox = yield select(selectors.getAllCheckbox)

    const { data } = yield call(Put, '/page_home', getAllCheckbox)

    yield put({
      payload: data,
      type   : types.PUT_FULFILLED
    })
  } catch (e) {
    const { type, message, response: { data: { message: messageResponse } = {} } = {} } = e
    switch (type) {
      case 'cancel':
        yield put({ type: types.PUT_CANCEL })
        break
      default:
        yield put({
          error: messageResponse || message,
          type : types.PUT_FAILURE
        })
        break
    }
  }
}
