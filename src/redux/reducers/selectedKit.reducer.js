const selectedKit = (state = 1, action) => {
    switch (action.type) {
      case 'SET_SELECTED_KIT':
        console.log('in SET_SELECTED_KIT',action.payload)
        return action.payload;
      default:
        return state;
    }
  };
  
  // user will be on the redux state at:
  // state.user
  export default selectedKit;
  