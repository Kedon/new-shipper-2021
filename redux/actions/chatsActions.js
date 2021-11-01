  export const activeChat = chat => ({
    type: 'ACTIVE_CHAT',
    activeChat: chat
  });

  export const activeScreen = screen => ({
    type: 'ACTIVE_SCREEN',
    activeScreen: screen
  });

  export const chatContacts = contacts => ({
    type: 'CHAT_CONTACTS',
    chatCont: contacts
  });

  export const chatSearch = term => ({
    type: 'CHAT_SEARCH',
    term
  });
  