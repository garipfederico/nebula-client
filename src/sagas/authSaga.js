import {call, put, takeEvery} from "redux-saga/effects";
import {
  loggingInSuccess,
  loggingInFail,
  loggingOutSuccess,
  getUserFail,
  getUserSuccess,
} from "../states/authState";
import axios from "axios";

const getUser = () => {
  const getAccessToken = () => {
    const auth = JSON.parse(window.localStorage.getItem("docu.auth"));
    if (auth) {
      return auth.access;
    }
    return undefined;
  };
  const access_token = getAccessToken();
  if (access_token) {
    const [, payload] = access_token.split(".");
    const decoded = window.atob(payload);
    return JSON.parse(decoded);
  }
  return undefined;
};



function* workPostAuthFetch(action) {
  try {
    console.log("A");
    const {username, password, navigate} = action.payload;
    console.info("username saga ", username);
    const url = `${process.env.REACT_APP_BASE_URL}/api/log-in/`;
    let response = {};
    // PETICION DE AUTENTICACION AL BACK 
    try {
      response = yield call(axios.post, url, {
        email: username,
        password: password,
      });
    } catch (error) {
      console.log("Error realizando la peticion del login: ", error);
      yield put(loggingInFail({error}));
      console.log("error ", error);
      throw error;
    }
    // GUARDADO DE TOKENS EN DISCO
    try {
      window.localStorage.setItem("docu.auth", JSON.stringify(response?.data));
      window.localStorage.setItem(
        "docu.auth.response",
        JSON.stringify(response)
      );
      const user = getUser(); // en modo mocked en el puerto 3001 no logra obtener el usuario
      yield put(loggingInSuccess({response, user}));
      yield call(navigate, "./home");
    } catch (error) {
      console.log("Error getting user info from local storage");
      console.error(error);
      yield put(loggingInFail({error}));
    }
  } catch (error) {
    console.log("Error tomando datos del front");
    console.log(error);
  }
}

function* workDeleteAuthFetch() {
  window.localStorage.removeItem("docu.auth");
  window.localStorage.removeItem("docu.auth.response");
  yield put(loggingOutSuccess());
}

function* workGetUserFetch(action) {
  try {
    const user = getUser();
    if (user) {
      yield put(getUserSuccess(user));
    } else {
      yield put(getUserFail(user));
    }
  } catch (error) {
    yield put(getUserFail());
    console.log("Unexpected error getting data from session storage");
  }
}

function* authSaga() {
  yield takeEvery("auth/loggingIn", workPostAuthFetch);
  yield takeEvery("auth/loggingOut", workDeleteAuthFetch);
  yield takeEvery("auth/getUser", workGetUserFetch);
}

export default authSaga;
