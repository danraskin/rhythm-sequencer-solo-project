const buffers = (state = {}, action) => {
    switch (action.type) {
      case 'SET_BUFFERS':
        return action.payload
      default:
        return state;
    }
  };
  
  export default buffers;
  