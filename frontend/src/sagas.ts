import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import { ATTEMPT_LOGIN, ATTEMPT_REGISTRATION, LOGIN_SUCCESS, LOGIN_UNSUCCESSFUL, SEND_EMAIL_FAILURE, SEND_EMAIL_SUCCESS, ATTEMPT_SEND_EMAIL } from "./actions/types";

const fetchPerson = (username: string, password: string) => {
  return fetch('http://localhost:8000/login?username=' + username + '&password=' + password).then(response => response.json())
}

// consulted the mdn docs very heavy initially for background on fetch for this
const registerInstructor = (username: string, password: string, regCode: number) => {
  return fetch('http://localhost:8000/instructorRegister?username=' + username + "&password=" + password + "&regCode=" + regCode, {
    method: 'POST'
  }).then(response => response.json());
}
const registerStudent = (username: string, password: string, regCode: string) => {
  return fetch('http://localhost:8000/studentRegister?username=' + username + "&password=" + password + "&regCode=" + regCode, {
    method: 'POST'
  }).then(response => response.json());
}

const sendEmailResponse = (accountId: string, emailSubject: string, emailBody: string) => {
  return fetch('http://localhost:8000/sendEmail?accountId=' + accountId + "&emailSubject=" + emailSubject + "&emailBody=" + emailBody + "&isBodyHtml=false", {
    method: 'POST'
  }).then(response => response.json());
}

function* login(action: any) {
    if (!action.payload) return;
    console.log(action.payload);
    const response = yield call(fetchPerson, action.payload.username, action.payload.password);
    console.log(response);
    if (response.success) {
      yield put({
        type: LOGIN_SUCCESS,
        payload: {
          isInstructor: response.isInstructor,
          loggedIn: response.success,
          regCode: response.regCode,
          accountId: response.accountId
        }
      });
    } else {
      yield put({
        type: LOGIN_UNSUCCESSFUL
      });
    }
    
}



function* register(action: any) {
  if (!action.payload) return;
  const { username, password, isInstructor, regCode } = action.payload;
  let registrationSuccess = false;
  let response: any = { msg: 'Unsuccessful Registration.'};
  if (isInstructor) {
    response = yield call(registerInstructor, username, password, regCode);
    registrationSuccess = response.success;
    console.log(response);
  } else {
    response = yield call(registerStudent, username, password, regCode);
    registrationSuccess = response.success;
  }
  if (registrationSuccess) {
    alert('Registration successful! Please log in.');
  } else {
    alert(response.msg);
  }
}

function* sendEmail(action: any) {
  if (!action.payload) return;
  const { accountId, emailSubject, emailBody } = action.payload;
  const response = yield call(sendEmailResponse, accountId, emailSubject, emailBody);
  const { success } = response;
  if (success) {
    yield put({
      type: SEND_EMAIL_SUCCESS
    });
    alert('Response submitted and send to instructor!');
  } else {
    yield put({
      type: SEND_EMAIL_FAILURE
    })
    alert('Response failed to send to instructor. Please contact instructor.');
  }
}

function* sagaWatcher() {
    yield takeLatest(ATTEMPT_LOGIN, login);
    yield takeLatest(ATTEMPT_REGISTRATION, register);
    yield takeLatest(ATTEMPT_SEND_EMAIL, sendEmail);
}

export default sagaWatcher;
