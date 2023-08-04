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
    console.log("auth ",auth )
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
  const {username, password, navigate} = action.payload;
  console.info("username saga ", username);
  const url = `${process.env.REACT_APP_BASE_URL}/api/log-in/`;
  let response = {}
  try {
    console.log("AAAAAA");
    console.info("url ", url);
    console.info("url ",'/api/log-in/')
    response = yield call(axios.post, url, {
      email: username,
      password: password,
    });} catch(e){
      console.log('Error realizando la peticion del login: ', e)
    }
    try{
    console.log('responseDDDDDDDDDDDDDDD', response?.data)
    window.localStorage.setItem("docu.auth", JSON.stringify(response?.data));
    console.log('BBBBBB')
    const user = getUser(); // en modo mocked en el puerto 3001 no logra obtener el usuario
    console.log('CCCCCC')
    console.log("BBBBBB", user);
    yield put(loggingInSuccess({response, user}));
    // TODO mejorar deberia ejecutar un evento que actualize 
    //  las credenciales en redux.
    window.location.reload() // TODO GDD-57  Solicitudes iniciales fallidas
    yield call(navigate, "./home");
  } catch (error) {
    console.log('Error getting user info from local storage')
    console.error(error);
    yield put(loggingInFail({error}));
  }
}

function* workDeleteAuthFetch() {
  window.localStorage.removeItem("docu.auth");
  yield put(loggingOutSuccess());
}

function* workGetUserFetch(action) {
  try {
    const user = getUser();
    yield put(getUserSuccess(user));
  } catch (error) {
    yield put(getUserFail());
  }
}

function* authSaga() {
  yield takeEvery("auth/loggingIn", workPostAuthFetch);
  yield takeEvery("auth/loggingOut", workDeleteAuthFetch);
  yield takeEvery("auth/getUser", workGetUserFetch);
}

export default authSaga;
