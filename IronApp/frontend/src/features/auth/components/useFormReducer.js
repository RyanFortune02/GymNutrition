/*
Reducer for multi-step form 
It is used to manage the state of the form by setting and resetting fields
*/
export function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return action.payload;
    default:
      return state;
  }
}
