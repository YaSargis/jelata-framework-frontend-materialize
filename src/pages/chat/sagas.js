import { call, takeEvery, put } from "redux-saga/effects";
import axios from "axios";
import { api } from 'src/defaults';
import { actions } from "./reducer";
import { message } from "antd";

const apiGetUsers = () => {
  return axios({
    method: 'get',
    url: api._url + '/api/dialogs',
    params: {},
		withCredentials: true,
		headers: {'Auth':localStorage.getItem('sesid')}
  })
}

function* getUsersCards() {
  try {
    const result = yield call(apiGetUsers)
    yield put({type: actions.listChats.type, payload: result?.data?.outjson}) 
  } catch(e) {
    message.error(e.name + ': ' + e.message)
  }
}

export function* main() {
  yield takeEvery(actions.requestListChats.type, getUsersCards)
}
