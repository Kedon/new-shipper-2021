import { USERDATA, USERDATAUPDATE, LOADINGAUTH, USERTOKEN } from "../actions/types";

const initialState = { user: [], loadingAuth: null, userToken: null }

const userDataReducer =  (state = initialState, action) => {
    switch (action.type) {
        case LOADINGAUTH:
            //alert('este alert está no reducer (TIMELINEDATA), mas esse texto aqui --> ('+ JSON.stringify(action.loadingAuth) + ' )vem da home')
            return { ...state, loadingAuth: action.loadingAuth }
        case USERTOKEN:
            //alert('este alert está no reducer (TIMELINEDATA), mas esse texto aqui --> ('+ JSON.stringify(action.timeline) + ' )vem da home')
            return { ...state, userToken: action.token }
        case USERDATA:
            //alert('este alert está no reducer (TIMELINEDATA), mas esse texto aqui --> ('+ JSON.stringify(action.timeline) + ' )vem da home')
            return { ...state, user: action.user }
        case USERDATAUPDATE:
            let changeUserData = state.user
            changeUserData.firstName = action.user.firstName
            changeUserData.genre = action.user.genre
            changeUserData.birthday = action.user.birthday
            changeUserData.email = action.user.email
            changeUserData.occupation = action.user.occupation
            changeUserData.description = action.user.description
            changeUserData.visibility = action.user.visibility
            return { ...state }
        default:
            return state
    }
}

export default userDataReducer;
