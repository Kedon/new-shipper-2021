import { USERDATA, USERDATAUPDATE, LOADINGAUTH, USERTOKEN } from "./types";

export const loadingAuth = toggle => ({
  type: LOADINGAUTH,
  loadingAuth: toggle
});

export const userData = user => ({
  type: USERDATA,
  user: user
});

export const userToken = token => ({
  type: USERTOKEN,
  token: token
});

export const userDataUpdate = user => ({
  type: USERDATAUPDATE,
  user: user
});