import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import keyBy from "lodash/keyBy";
import {
  ATTEMPT_LOGIN,
  ATTEMPT_REGISTRATION,
  LOGIN_SUCCESS,
  SETUP_LOGIN_UNSUCCESSFUL,
  LOG_OUT,
  SETUP_APP,
  GET_ALL_COURSES,
  SAVE_COURSES,
  GET_CURRICULUM,
  SAVE_CURRICULUM,
  SET_CURRICULUM,
  ADD_REG_CODE,
  SUBMIT_QUIZ,
  GET_ALL_GRADES,
  SAVE_GRADES,
  SAVE_ANSWERS,
  GET_ANSWERS,
  GET_QUIZ_STATUS,
  SAVE_QUIZ_STATUS,
  GET_REVIEWS,
  SAVE_REVIEWS,
  CREATE_REVIEW,
} from "./actions/types";
import { AnswerType } from "./model/CourseType";


const BASE_URL = 'http://localhost:8000';
const queryParams = (args: { [index: string]: string }): string => {
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


type NetworkErrorCallback = (error: any) => void;

const fetchGetWrapper = (
  route: string,
  queryArgs?: { [index: string]: string },
  networkErrorCallback?: NetworkErrorCallback,
  baseUrl?: string,
  headers?: { [index: string]: string }
) => {
  const baseUrlToFetch = baseUrl ? baseUrl : BASE_URL;
  const token = getTokenInCookie();
  let fetchHeaders: Headers = new Headers();
  if (token !== "") {
    fetchHeaders.set("Authorization", `Bearer ${getTokenInCookie()}`);
  }
  if (headers) {
    Object.keys(headers).forEach((headerKey: string): void => {
      fetchHeaders.set(headerKey, headers[headerKey]);
    });
  }
  const url = queryArgs
    ? `${baseUrlToFetch}${route}${queryParams(queryArgs)}`
    : `${baseUrlToFetch}${route}`;
  return fetch(url, {
    method: "GET",
    mode: 'cors',
    headers: fetchHeaders
  })
    .then(response => response.json(), reason => reason)
    .catch(err => networkErrorCallback && networkErrorCallback(err));
}

const fetchPostWrapper = (
  route: string,
  postBody: object,
  networkErrorCallback?: NetworkErrorCallback,
  baseUrl?: string,
  headers?: { [index: string]: string },
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
  return fetch(`${baseUrlToFetch}${route}`, {
    method: "POST",
    mode: 'cors',
    headers: fetchHeaders,
    body: JSON.stringify(postBody)
  })
    .then(response => response.json(), reason => reason)
    .catch(err => {
      networkErrorCallback && networkErrorCallback(err);
      console.error(err);
    });
}

// API calls

const getAccount = (networkErrorCallback?: NetworkErrorCallback) => {
  return fetchGetWrapper('/getAccount', undefined, networkErrorCallback);
}

const loginPerson = (username: string, password: string, networkErrorCallback?: NetworkErrorCallback) => {
  return fetchPostWrapper('/login', { username, password }, networkErrorCallback);
}

// consulted the mdn docs very heavy initially for background on fetch for this
const registerInstructor = (username: string, password: string, regCode: number, networkErrorCallback?: NetworkErrorCallback) => {
  return fetchPostWrapper('/instructorRegister', { username, password, regCode }, networkErrorCallback);
}
const registerStudent = (username: string, password: string, regCode: string, networkErrorCallback?: NetworkErrorCallback) => {
  return fetchPostWrapper('/studentRegister', { username, password, regCode }, networkErrorCallback);
}

const getAllCourses = (networkErrorCallback?: NetworkErrorCallback) => {
  return fetchGetWrapper('/getAllCourses', undefined, networkErrorCallback);
}

const getCurriculum = (networkErrorCallback?: NetworkErrorCallback) => {
  return fetchGetWrapper('/getCurriculum', undefined, networkErrorCallback);
}

const setCurriculum = (regCode: string, courseIds: string[], networkErrorCallback?: NetworkErrorCallback) => {
  return fetchPostWrapper('/setCurriculum', { regCode, courses: courseIds }, networkErrorCallback);
}

const addRegCode = (regCode: string, networkErrorCallback?: NetworkErrorCallback) => {
  return fetchPostWrapper('/addRegCode', { regCode }, networkErrorCallback);
}

const submitReview = (regCode: string, courseId: string, response: string, networkErrorCallback?: NetworkErrorCallback) => {
  return fetchPostWrapper('/createReview', { regCode, courseId, response }, networkErrorCallback);
}

const submitQuiz = (regCode: string, courseId: string, answers: AnswerType[], emailResponse: string, networkErrorCallback?: NetworkErrorCallback) => {
  return fetchPostWrapper('/submitQuiz', { regCode, courseId, answers, emailResponse }, networkErrorCallback);
}
const getAllGrades = (networkErrorCallback?: NetworkErrorCallback) => {
  return fetchGetWrapper('/getAllGrades', undefined, networkErrorCallback);
}

const getAnswers = (regCode: string, courseId: string, networkErrorCallback?: NetworkErrorCallback) => {
  return fetchGetWrapper('/getAnswers', { regCode, courseId }, networkErrorCallback);
}

const getQuizStatus = (regCode: string, courseId: string) => {
  return fetchPostWrapper('/getQuizStatus', { regCode, courseId });
}

const getReviews = (regCode: string) => {
  return fetchGetWrapper('/getReviews', { regCode });
}

// helper functions

// TODO: maybe move this away from a string check?
const isTokenValid = (response: any): void => {
  if (response.msg && response.msg === "Invalid Token") {
    alert('Session has expired. Please login again.');
    document.location.href = '/profile';
    storeTokenInCookie('');
  }
}

// saga watchers

function* login(action: any) {
  if (!action.payload) return;
  const response = yield call(loginPerson, action.payload.username, action.payload.password);
  if (response.success) {
    yield put({
      type: LOGIN_SUCCESS,
      payload: {
        isInstructor: response.isInstructor,
        loggedIn: response.success,
        regCodes: response.regCode,
        accountId: response.accountId,
        username: action.payload.username
      }
    });
    storeTokenInCookie(response.token);
    yield put({ type: GET_ALL_COURSES });
    yield put({ type: GET_CURRICULUM });
    yield put({ type: GET_ALL_GRADES });
  } else {
    alert(response.msg);
  }

}

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
          regCodes: account.regCode,
          accountId: account.accountId,
          username: account.username
        }
      });
      yield put({ type: GET_ALL_COURSES });
      yield put({ type: GET_CURRICULUM });
      yield put({ type: GET_ALL_GRADES });
    }
  } else {
    yield put({
      type: SETUP_LOGIN_UNSUCCESSFUL
    })
  }
}

function* logOut() {
  storeTokenInCookie("");
  document.location.href = '/profile';
  return;
}

function* register(action: any) {
  if (!action.payload) return;
  const { username, password, isInstructor, regCode } = action.payload;
  let registrationSuccess = false;
  let response: any = { msg: 'Unsuccessful Registration.' };
  let errorCallback: NetworkErrorCallback = (error) => {
    alert('Error contacting server on registration. Please try again.')
  }
  if (isInstructor) {
    response = yield call(registerInstructor, username, password, regCode, errorCallback);
    registrationSuccess = response.success;
  } else {
    response = yield call(registerStudent, username, password, regCode, errorCallback);
    registrationSuccess = response.success;
  }
  if (registrationSuccess) {
    alert('Registration successful! Please log in.');
  } else {
    alert(response.msg);
  }
}

function* getAllCoursesSaga() {
  const response = yield call(getAllCourses);
  isTokenValid(response);
  let errorCallback: NetworkErrorCallback = (_) => {
    alert('Failed to get course information. Refreshing.');
    document.location.reload();
  }
  if (response.success) {
    yield put({
      type: SAVE_COURSES,
      payload: {
        courses: response.courses
      }
    })
  } else {
    errorCallback(null);
  }
}


function* getCurriculumSaga(action: any) {
  const response = yield call(getCurriculum);
  isTokenValid(response);
  let errorCallback: NetworkErrorCallback = (_) => {
    alert('Failed to get course information. Refreshing.');
    document.location.reload();
  }
  if (response.success) {
    yield put({
      type: SAVE_CURRICULUM,
      payload: {
        curriculum: keyBy(response.curriculum, "regCode")
      }
    })
  } else {
    errorCallback(null);
  }
}

function* setCurriculumSaga(action: any) {
  if (!action.payload) return;
  let errorCallback: NetworkErrorCallback = (_) => {
    alert('Failed to successfully connect to server on curriculum set attempt.');
  }
  const response = yield call(setCurriculum, action.payload.regCode, action.payload.courseIds, errorCallback);
  isTokenValid(response);
  if (response.success) {
    alert(`Curriculum for registration code ${action.payload.regCode} set!`);
    document.location.href = '/profile';
  } else {
    alert(response.msg);
  }

}

function* addRegCodeSaga(action: any) {
  if (!action.payload || !action.payload.regCode || action.payload.regCode === "") return;
  let errorCallback: NetworkErrorCallback = (_) => {
    alert('Failed to successfully connect to server on add registration code to account.');
  }
  const response = yield call(addRegCode, action.payload.regCode, errorCallback);
  isTokenValid(response);
  if (response.success) {
    alert(`Registration code ${action.payload.regCode} added!`);
    document.location.href = '/profile';
  } else {
    alert(response.msg);
  }
}

function* submitReviewSaga(action: any) {
  if (!action.payload || !action.payload.regCode || action.payload.regCode === "" || action.payload.courseId === "" || action.payload.response === "") return;
  let errorCallback: NetworkErrorCallback = (_) => {
    alert('Failed to successfully connect to server on submit review.');
  }
  const response = yield call(submitReview, action.payload.regCode, action.payload.courseId, action.payload.response, errorCallback);
  isTokenValid(response);
  if (response.success) {
    alert(`Review Added!`);
    document.location.href = '/profile';
  } else {
    alert(response.msg);
  }
}

function* submitQuizSaga(action: any) {
  if (!action.payload
    || !action.payload.regCode
    || action.payload.courseId === undefined
    || !action.payload.emailResponse
    || !action.payload.answers) {
    return;
  }
  const { regCode, courseId, emailResponse, answers } = action.payload;
  let errorCallback: NetworkErrorCallback = (_) => {
    alert('Failed to successfully connect to server on quiz submission.');
  }
  const response = yield call(submitQuiz, regCode, String(courseId), answers, emailResponse, errorCallback);
  isTokenValid(response);
  if (response.success) {
    alert('Quiz Submitted!');
    document.location.href = '/profile';
  } else {
    alert(response.msg);
  }
}



function* getAllGradesSaga(action: any) {
  let errorCallback: NetworkErrorCallback = (_) => {
    alert('Failed to successfully connect to server to obtain grades.');
    window.location.reload();
  }
  const response = yield call(getAllGrades, errorCallback);
  console.log(response);
  isTokenValid(response);
  if (response.success) {
    yield put({
      type: SAVE_GRADES,
      payload: {
        grades: response.grades
      }
    })
  } else {
    alert(response.msg);
    window.location.reload();
  }
}

function* getAnswersSaga(action: any) {
  if (!action.payload || !action.payload.regCode || !action.payload.courseId) return;
  const { regCode, courseId } = action.payload;
  let errorCallback: NetworkErrorCallback = (_) => {
    alert('Failed to successfully connect to server to obtain grades.');
  }
  const response = yield call(getAnswers, regCode, courseId, errorCallback);
  if (response.success) {
    yield put({
      type: SAVE_ANSWERS,
      payload: {
        answers: response.answers
      }
    })
  } else if (response.reason) {
    yield put({
      type: SAVE_ANSWERS,
      payload: {
        answers: response.reason
      }
    })
  } else {
    alert(response.msg);
  }
}

function* getQuizStatusSaga(action: any) {
  if (!action.payload || !action.payload.regCode || !action.payload.courseId) return;
  const { regCode, courseId } = action.payload;
  const response = yield call(getQuizStatus, regCode, courseId);
  if (response.success) {
    yield put({
      type: SAVE_QUIZ_STATUS,
      payload: {
        completed: response
      }
    })
  }
}

function* getReviewsSaga(action: any) {
  if (!action.payload || !action.payload.regCode) return;
  const { regCode } = action.payload;
  const response = yield call(getReviews, regCode);
  console.log(response);
  if (response.success) {
    yield put({
      type: SAVE_REVIEWS,
      payload: {
        reviews: response.reviews
      }
    })
  }
}

function* sagaWatcher() {
  yield takeEvery(CREATE_REVIEW, submitReviewSaga);
  yield takeLatest(ATTEMPT_LOGIN, login);
  yield takeLatest(ATTEMPT_REGISTRATION, register);
  yield takeLatest(LOG_OUT, logOut);
  yield takeLatest(SETUP_APP, setupApp);
  yield takeLatest(GET_ALL_COURSES, getAllCoursesSaga);
  yield takeEvery(GET_CURRICULUM, getCurriculumSaga);
  yield takeLatest(SET_CURRICULUM, setCurriculumSaga);
  yield takeLatest(ADD_REG_CODE, addRegCodeSaga);
  yield takeLatest(SUBMIT_QUIZ, submitQuizSaga);
  yield takeEvery(GET_ALL_GRADES, getAllGradesSaga);
  yield takeEvery(GET_ANSWERS, getAnswersSaga);
  yield takeEvery(GET_QUIZ_STATUS, getQuizStatusSaga);
  yield takeEvery(GET_REVIEWS, getReviewsSaga);
}

export default sagaWatcher;
