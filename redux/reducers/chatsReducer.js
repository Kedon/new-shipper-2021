
const initialState = {
    activeChat: null,
    activeScreen: null,
    chatCont: [],
    filteredContacts: []
}
  
  const Chats = (state = initialState, action) => {
    switch (action.type) {
      case "ACTIVE_CHAT":
        return { ...state, activeChat: action.activeChat }
      case "CHAT_CONTACTS":
        return { ...state, chatCont: action.chatCont }
      case "CHAT_SEARCH":
        let filteredContacts = state.chatCont && state.chatCont.filter(val => {
          if (action.term.length > 0) {
            return (
              val.guest.firstName.toLowerCase().includes(action.term) ||
              val.owner.firstName.toLowerCase().includes(action.term) 
            )
          } else {
            return state.chatCont
          }
        })
  
        return { ...state, filteredContacts }
      case "ACTIVE_SCREEN":
        return { ...state, activeScreen: action.activeScreen }
      default:
        return { ...state }
    }
  }
  
  
  export default Chats
  