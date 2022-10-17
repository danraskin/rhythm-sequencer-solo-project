const samples = (state = [], action) => {
    switch (action.type) {
      case 'SET_SAMPLES':
        return action.payload;
      default:
        return state;
    }
  };

  export default samples;
  