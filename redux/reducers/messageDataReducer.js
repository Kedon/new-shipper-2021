import { MESSAGEDATA } from "../actions/types";

const initialState = {
  message: {

  }
};
const messageDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case MESSAGEDATA:
      return {
        ...state,
        message: action.message
      };
    default:
      return state;
  }
};

export default messageDataReducer;