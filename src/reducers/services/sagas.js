import { GetList, Delete, Post, Get, Put } from 'lib/Request'
import { put, call, select } from 'redux-saga/effects'
import notify from 'lib/Notify'
import usersDucks from 'reducers/users'

export const getServices = ({ types, selectors }) => function* () {
  try {
    yield put({ type: types.FETCH_PENDING })
    const getPagination = yield select(selectors.pagination)

    const params = {
      page   : getPagination.page,
      perPage: getPagination.perPage
    }

    const { data: { rows, pagination, columns } } = yield call(GetList, '/services', params)

    yield put({
      payload: {
        columns,
        pagination,
        rows
      },
      type: types.FETCH_FULFILLED
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

export const removeService = ({ types }) => function* ({ id }) {
  try {
    yield put({ type: types.DELETE_PENDING })
    const cookies = yield select(usersDucks.selectors.getCookies)

    const { success } = yield call(Delete, `/services/${id}`, {}, {
      Authorization: `Bearer ${cookies}`
    })
    if(success)
      notify.success('!Successfully removed!', { time: 5000 })
    else
      notify.error('!An error occurred!', { time: 5000 })
    yield put({
      payload: {
        id,
        success
      },
      type: types.DELETE_SERVICE_FULFILLED
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

export const createService = ({ types }) => function* ({ payload }) {
  try {
    yield put({ type: types.POST_PENDING })
    const cookies = yield select(usersDucks.selectors.getCookies)

    const formData = new FormData()
    const payloadData = Object.keys(payload)
    payloadData.map(item => {
      if(item === 'content')
        formData.append(item, JSON.stringify(payload[item]))
      else
        formData.append(item, payload[item])
    })
    const { data, success } = yield call(Post, '/services', formData, {
      Authorization : `Bearer ${cookies}`,
      'content-type': 'multipart/form-data'
    })
    if(success)
      notify.success('!Created successfully!', { time: 5000 })
    else
      notify.error('!An error occurred!', { time: 5000 })
    yield put({
      payload: {
        data,
        success
      },
      type: types.POST_SERVICE_FULFILLED
    })
  } catch (e) {
    const { type, message, response: { data: { message: messageResponse } = {} } = {} } = e
    switch (type) {
      case 'cancel':
        yield put({ type: types.POST_CANCEL })
        break
      default:
        yield put({
          error: messageResponse || message,
          type : types.POST_FAILURE
        })
        break
    }
  }
}

export const getService = ({ types }) => function* ({ id }) {
  try {
    yield put({ type: types.FETCH_PENDING })
    const { data: serviceDetail, success } = yield call(Get, `/services/${id}`)
    yield put({
      payload: {
        serviceDetail,
        success
      },
      type: types.FETCH_FULFILLED
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

export const updateService = ({ types }) => function* ({ payload }) {
  try {
    yield put({ type: types.PUT_PENDING })
    const cookies = yield select(usersDucks.selectors.getCookies)

    const formData = new FormData()
    const payloadData = Object.keys(payload)
    payloadData.map(item => {
      if(item === 'content')
        formData.append(item, JSON.stringify(payload[item]))
      else
        formData.append(item, payload[item])
    })

    const { success } = yield call(Put, '/services', formData, {
      Authorization : `Bearer ${cookies}`,
      'content-type': 'multipart/form-data'
    })
    if(success)
      notify.success('!Was updated correctly!', { time: 5000 })
    else
      notify.error('!An error occurred!', { time: 5000 })
    yield put({
      payload: {
        success
      },
      type: types.PUT_FULFILLED
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
