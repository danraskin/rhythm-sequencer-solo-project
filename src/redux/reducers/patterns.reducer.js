const patterns = (state = [], action) => {
    switch (action.type) {
      case 'SET_USER_PATTERNS':
        return action.payload;
      default:
        return state;
    }
  };
  
  export default patterns;
  