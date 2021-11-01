import { APPSTATE } from "../actions/types";

const initialState = { checkin: [] }

const appStateReducer =  (state = initialState, action) => {
    switch (action.type) {
        case APPSTATE:
            //alert('este alert está no reducer (TIMELINEDATA), mas esse texto aqui --> ('+ JSON.stringify(action.timeline) + ' )vem da home')
            return { ...state, app: action.app }
        default:
            return state
    }
}

export default appStateReducer;
