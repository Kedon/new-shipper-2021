import { CHECKINDATA } from "../actions/types";

const initialState = { checkin: [] }

const checkinDataReducer =  (state = initialState, action) => {
    switch (action.type) {
        case CHECKINDATA:
            //alert('este alert está no reducer (TIMELINEDATA), mas esse texto aqui --> ('+ JSON.stringify(action.timeline) + ' )vem da home')
            return { ...state, checkin: action.checkin }
        default:
            return state
    }
}

export default checkinDataReducer;
