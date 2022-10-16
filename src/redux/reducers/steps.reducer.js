const steps = (state = {}, action) => {
    switch (action.type) {
      case 'SET_PATTERN_STEPS':
        return action.payload;
      default:
        return state;
    }
  };
  
  export default steps;
  