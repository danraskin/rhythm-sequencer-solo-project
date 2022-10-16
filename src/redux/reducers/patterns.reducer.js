const patterns = (state = [], action) => {
    switch (action.type) {
      case 'SET_USER_PATTERNS':
        return action.payload;
      default:
        return state;
    }
  };
  
  // user will be on the redux state at:
  // state.user
  export default patterns;
  