import { call, put, takeLatest, takeEvery } from "redux-saga/effects";

// copied/modified from https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
    },
    referrerPolicy: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response;
}

function* loginStudent(action: any) {
    if (!action.payload) return;
    console.log(action.payload);
    const x = yield call(fetch, 'http://localhost:8000/login?username=' + action.payload.username + '&password=' + action.payload.password, {
      mode: 'no-cors'
    });
    console.log(x);
}

function* sagaWatcher() {
    yield takeLatest('ATTEMPT_LOGIN', loginStudent);
}

export default sagaWatcher;
