const selectedKit = (state = {}, action) => {
    switch (action.type) {
      case 'SET_NEW_KIT':
        return action.samples[0] //SHOULD SEED SELECTEDKIT TO KIT 1
      case 'SET_SELECTED_KIT':
        for (let kit of action.payload.samples) {
          if (Number(action.payload.kit_id) === kit.id) {
            console.log('in SET_SELECTED_KIT', kit.id)
            return kit;
          }
        }
      default:
        return state;
    }
  };
  
  export default selectedKit;
  