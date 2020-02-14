import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import { ATTEMPT_LOGIN, ATTEMPT_REGISTRATION } from "./actions/types";

const fetchPerson = (username: string, password: string) => {
  return fetch('http://localhost:8000/login?username=' + username + '&password=' + password).then(response => response.json())
}

// consulted the mdn docs very heavy initially for background on fetch for this
const registerInstructor = (username: string, password: string, regCode: number) => {
  return fetch('http://localhost:8000/instructorRegister?username=' + username + "&password=" + password + "&regCode=" + regCode, {
    method: 'POST'
  }).then(response => response.json());
}
const registerStudent = (username: string, password: string, regCode: number) => {
  return fetch('http://localhost:8000/studentRegister?username=' + username + "&password=" + password + "&regCode=" + regCode, {
    method: 'POST'
  }).then(response => response.json());
}

function* login(action: any) {
    if (!action.payload) return;
    console.log(action.payload);
    const x = yield call(fetchPerson, action.payload.username, action.payload.password);
    console.log(x);
}



function* register(action: any) {
  if (!action.payload) return;
  console.log(action.payload);
  const { username, password, isInstructor, regCode } = action.payload;
  if (isInstructor) {
    const response = yield call(registerInstructor, username, password, regCode);
    console.log(response);
  } else {
    const response = yield call(registerStudent, username, password, regCode);
    console.log(response);
  }
}

function* sagaWatcher() {
    yield takeLatest(ATTEMPT_LOGIN, login);
    yield takeLatest(ATTEMPT_REGISTRATION, register);

}

export default sagaWatcher;
