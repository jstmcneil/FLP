import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import { ATTEMPT_LOGIN, ATTEMPT_REGISTRATION, LOGIN_SUCCESS, LOGIN_UNSUCCESSFUL, SEND_EMAIL_FAILURE, SEND_EMAIL_SUCCESS, ATTEMPT_SEND_EMAIL, LOG_OUT, SETUP_APP } from "./actions/types";

const BASE_URL = 'http://localhost:8000';
const queryParams = (args: {[index: string]: string}): string => {
  return `?${Object.keys(args).map(key => `${key}=${args[key]}`).join('&')}`;
}

const storeTokenInCookie = (token: string) => {
  document.cookie = `token=${token};path=/`;
}
const getTokenInCookie = () => {
  const tokenKeyPlusEqual = "token=";
  const tokenKeyIndex = document.cookie.indexOf(tokenKeyPlusEqual);
  if (tokenKeyIndex < 0) {
    return "";
  }
  const documentCookieStringAfterTokenKey = document.cookie.substring(tokenKeyIndex + tokenKeyPlusEqual.length);
  const endDelimiter = documentCookieStringAfterTokenKey.indexOf(';') !== -1
    ? documentCookieStringAfterTokenKey.indexOf(';')
    : documentCookieStringAfterTokenKey.length;
  return documentCookieStringAfterTokenKey.substring(0, endDelimiter);
}

const fetchGetWrapper = (
  route: string,
  queryArgs?: {[index: string]: string},
  baseUrl?: string,
  headers?: {[index: string]: string}
  ) => {
  const baseUrlToFetch = baseUrl ? baseUrl : BASE_URL;
  const token = getTokenInCookie();
  console.log(token);
  let fetchHeaders: Headers = new Headers();
  if (token !== "") {
      fetchHeaders.set("Authorization", `Bearer ${getTokenInCookie()}`);
  }
  if (headers) {
      Object.keys(headers).forEach((headerKey: string): void => {
        fetchHeaders.set(headerKey, headers[headerKey]);
      });
  }
  console.log(fetchHeaders);
  const url = queryArgs 
    ? `${baseUrlToFetch}${route}${queryParams(queryArgs)}`
    : `${baseUrlToFetch}${route}`;
  return fetch(url, { 
    method: "GET",
    mode: 'cors',
    headers: fetchHeaders
  })
    .then(response => response.json(), reason => reason);
}

const fetchPostWrapper = (
  route: string,
  postBody: object,
  baseUrl?: string,
  headers?: {[index: string]: string}
) => {
  const baseUrlToFetch = baseUrl ? baseUrl : BASE_URL;
  const token = getTokenInCookie();
  let fetchHeaders: Headers = new Headers();
  fetchHeaders.set("Content-Type", `application/json`);
  if (token !== "") {
      fetchHeaders.set("Authorization", `Bearer ${getTokenInCookie()}`);
  }
  if (headers) {
      Object.keys(headers).forEach((headerKey: string): void => {
        fetchHeaders.set(headerKey, headers[headerKey]);
      });
  }
  console.log(fetchHeaders);
  return fetch(`${baseUrlToFetch}${route}`, { 
    method: "POST",
    mode: 'cors',
    headers: fetchHeaders,
    body: JSON.stringify(postBody)
  })
    .then(response => response.json(), reason => reason);
}

// API calls

const getAccount = () => {
  return fetchGetWrapper('/getAccount');
}

const loginPerson = (username: string, password: string) => {
  return fetchPostWrapper('/login', { username, password });
}

// consulted the mdn docs very heavy initially for background on fetch for this
const registerInstructor = (username: string, password: string, regCode: number) => {
  return fetchPostWrapper('/instructorRegister', { username, password, regCode });
}
const registerStudent = (username: string, password: string, regCode: string) => {
  return fetchPostWrapper('/studentRegister', { username, password, regCode });
}

const sendEmailResponse = (accountId: string, emailSubject: string, emailBody: string) => {
  return fetchGetWrapper('/sendEmail', { accountId, emailSubject, emailBody,  isBodyHtml: "false" });
}

function* login(action: any) {
    if (!action.payload) return;
    console.log(action.payload);
    const response = yield call(loginPerson, action.payload.username, action.payload.password);
    console.log(response);
    if (response.success) {
      yield put({
        type: LOGIN_SUCCESS,
        payload: {
          isInstructor: response.isInstructor,
          loggedIn: response.success,
          regCode: response.regCode,
          accountId: response.accountId,
        }
      });
      storeTokenInCookie(response.token);
    } else {
      yield put({
        type: LOGIN_UNSUCCESSFUL
      });
    }
    
}

// saga watchers

function* setupApp() {
  const response = yield call(getAccount);
  if (response.success) {
    const account = response.account;
    if (account) {
      yield put({
        type: LOGIN_SUCCESS,
        payload: {
          isInstructor: account.isInstructor,
          loggedIn: true,
          regCode: account.regCode,
          accountId: account.accountId
        }
      });
    }
  }
}

function* logOut() {
  storeTokenInCookie("");
  return;
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
  const success = response ? response.success : false;
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
    yield takeLatest(LOG_OUT, logOut);
    yield takeLatest(SETUP_APP, setupApp);
}

export default sagaWatcher;
