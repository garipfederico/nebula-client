import {call, put, takeEvery} from "redux-saga/effects";
import {
  getOptionsStateSuccess,
  getOptionsStateFail,
  getDocuments,
  getDocumentsSuccess,
  getDocumentsFail,
  putStateSuccess,
  putStateFail,
} from "../states/batchesState";
import axiosBase from "../utils/axiosBase";
import MockAdapter from "axios-mock-adapter";

import {OptionsState, documents} from "./mockData";

//URLs
const URL_BASE = process.env.REACT_APP_BASE_URL;
const URL_optionsState = URL_BASE + "/api/document-status";
const parcialURLdocument = "/api/document/"
const URL_document = URL_BASE + parcialURLdocument;

// REACT_APP_ENVIRONMENT_TYPE = dev | mocked | test
function* requestManager(apiCallFunction, anUrl, anObject = null) {
  console.log(process.env.REACT_APP_ENVIRONMENT_TYPE === "mocked")
  console.log("anUrl ",anUrl )
  let request = {}
  if (process.env.REACT_APP_ENVIRONMENT_TYPE === "mocked") {
    console.log("Executing in mocked mode");
    var mock = new MockAdapter(axiosBase);
    // mock.onGet(anUrl).reply(200, {...OptionsState})
    // .onGet(anUrl).reply(200, {...documents})
    // .onPut(anUrl).reply(200)
    mock.onGet(anUrl).reply(401, {message: "Unauthorized"})
    .onGet(anUrl).reply(401,  {message: "Unauthorized"})
    .onPut(anUrl).reply( 401, {message: "Unauthorized"})
    request = yield call(apiCallFunction, anUrl, anObject)
    console.log("request ",request )
    mock.restore()
  } else {
    console.log("Executing in dev mode");
    request = yield call(apiCallFunction, anUrl, anObject);
    console.log("request ",request );

  }
  return request
}

function* workGetOptionsStates() {
  //Call to get the options state for the combobox
  try {
      const stateOptionsRequest = yield requestManager(axiosBase.get, URL_optionsState)
      console.log("stateOptionsRequest ",stateOptionsRequest.data.results )
    yield put(
      getOptionsStateSuccess({
        stateOptions: {...stateOptionsRequest.data.results},
      })
    );
    // yield put(getDocuments())
  } catch (e) {
    console.log("Error trying to get from API the options state");
    console.log(e);
    yield put(getOptionsStateFail({e}));
  }
}

function* workGetDocuments(action) {
  const {page, rowsPerPage} = action.payload;
  const offset = page * rowsPerPage;
  let URL = URL_document;
  URL += "?limit=" + rowsPerPage + "&offset=" + offset;
  console.log(URL_document);


  // Call to get the documents for the table
  try {
    const documentsRequest = yield requestManager(axiosBase.get, URL)
    console.log("documentsRequest ", documentsRequest.data);
    yield put(getDocumentsSuccess({documents: {...documentsRequest.data}}));
  } catch (e) {
    console.log("Error trying to get from API the documents");
    console.log(e);
    yield put(getDocumentsFail({e}));
  }
  return;
}

function* workPutDocumentState(action) {
  console.log(action.payload);
  try {
  const {name, id, page, rowsPerPage }= action.payload
  const URLRequest =  URL_BASE + parcialURLdocument + id + '/manage-status'
  console.log(URLRequest)
    const documentsResponse = yield requestManager(axiosBase.put, URLRequest, {
      status: name
    });
    console.log("documentsResponse ", documentsResponse);
    yield put(putStateSuccess());
    yield put(getDocuments({page, rowsPerPage}))
  } catch (e) {
    console.log("Error trying to get from API the documents");
    console.log(e);
    yield put(putStateFail(e.response));
  }
  return;
}

function* batchesSaga() {
    yield takeEvery("batches/getOptionsState", workGetOptionsStates);
    yield takeEvery("batches/getDocuments", workGetDocuments);
    yield takeEvery("batches/putState", workPutDocumentState);
}

export default batchesSaga;
