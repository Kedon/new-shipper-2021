import { MESSAGEDATA } from "./types";

export const messageData = message => {
  return {
    type: MESSAGEDATA,
    message: message
  };
};