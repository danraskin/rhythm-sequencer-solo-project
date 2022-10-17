const grid = (state = [], action) => {
    switch (action.type) {
      case 'SET_GRID':
        return action.payload;
      default:
        return state;
    }
  };

  export default grid;
  