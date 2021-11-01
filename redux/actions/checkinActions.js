import { CHECKINDATA } from "./types";

export const checkinData = checkin => ({
  type: CHECKINDATA,
  checkin: checkin
});
