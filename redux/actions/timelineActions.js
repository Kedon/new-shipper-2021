import { TIMELINEDATA, TIMELINEDATA_LOADING, TIMELINE_REMOVE, TIMELINEDATA_UPDATE } from "./types";

export const timelineData = timeline => ({
  type: TIMELINEDATA,
  timeline: timeline
});

export const timelineDataLoading = loading => ({
  type: TIMELINEDATA_LOADING,
  loading
});

export const timelineRemove = userId => ({
  type: TIMELINE_REMOVE,
  userId
});

export const timelineDataUpdate = userId => ({
  type: TIMELINEDATA_UPDATE,
  userId
});
