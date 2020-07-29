import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";

/* Reducers */
import languageReducer from "./reducers/languageReducer";
import homeReducer from "./reducers/homeReducer";
import adminReducer from "./reducers/adminReducer";
import imagesReducer from "./reducers/imagesReducer";
import removeImagesReducer from "./reducers/removeImagesReducer";

const AllReducers = combineReducers({
    language: languageReducer,
    home: homeReducer,
    admin: adminReducer,
    images: imagesReducer,
    removeImages: removeImagesReducer,
});

const InitialState = {};
const middleware = [
    thunk,
];

const store = createStore(
    AllReducers,
    InitialState,
    compose(composeWithDevTools(applyMiddleware(...middleware)))
);

export default store;