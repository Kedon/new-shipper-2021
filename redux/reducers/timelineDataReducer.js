import { TIMELINEDATA, TIMELINEDATA_LOADING, TIMELINE_REMOVE, TIMELINEDATA_UPDATE } from "../actions/types";

const initialState = { timeline: [], loading: false }

const timelineDataReducer =  (state = initialState, action) => {
    switch (action.type) {
        case TIMELINEDATA:
            return { ...state, timeline: action.timeline }
        case TIMELINE_REMOVE:
            const deleteIndexComment = state.timeline.timeline
                .findIndex(elem => elem.userId === action.userId);

            return {
                ...state, timeline: {
                timeline: [
                    ...state.timeline.timeline.slice(0, deleteIndexComment),
                    ...state.timeline.timeline.slice(deleteIndexComment + 1)
                ]
            }
            };
      
        case TIMELINEDATA_LOADING:
            return { ...state, loading: action.loading }
        case TIMELINEDATA_UPDATE:
            
            let timeline = state.timeline
            let updateTimeline = timeline.timeline.find(f => f.userId === action.userId)
            updateTimeline.haveLike = updateTimeline.haveLike === 0 ? 1 : 0;
            updateTimeline.totalLikes = updateTimeline.haveLike === 0 ? updateTimeline.totalLikes - 1 : updateTimeline.totalLikes + 1;
            return { ...state }
        default:
        return state
    }
}

export default timelineDataReducer;
