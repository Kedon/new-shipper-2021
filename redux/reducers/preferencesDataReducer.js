import { PREFERENCESDATA } from "../actions/types";

const initialState = { preferences: [] }

const preferencesDataReducer =  (state = initialState, action) => {
    switch (action.type) {
        case PREFERENCESDATA:
            //alert('este alert está no reducer (TIMELINEDATA), mas esse texto aqui --> ('+ JSON.stringify(action.preferences) + ' )vem da home')
            return { ...state, preferences: action.preferences }
        default:
            return state
    }
}

export default preferencesDataReducer;
