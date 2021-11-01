import { createStore, combineReducers } from "redux";

import messageDataReducer from "../reducers/messageDataReducer";
import timelineDataReducer from "../reducers/timelineDataReducer";
import preferencesDataReducer from "../reducers/preferencesDataReducer";
import userDataReducer from "../reducers/userDataReducer";
import checkinDataReducer from "../reducers/checkinDataReducer";
import appStateReducer from "../reducers/appStateReducer";
import chatsReducer from "../reducers/chatsReducer";

const rootReducer = combineReducers({
  messageData: messageDataReducer,
  timelineData: timelineDataReducer,
  preferencesData: preferencesDataReducer,
  userData: userDataReducer,
  checkinData: checkinDataReducer,
  appState: appStateReducer,
  chats: chatsReducer
});

const configureStore = () => {
  return createStore(rootReducer);
};

export default configureStore;