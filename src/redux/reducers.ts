import { AppState } from "../types";
import { SET_FIELD, SET_APPOINTMENTS, SET_ERROR, RESET } from "../redux/actions";

const initialState: AppState = {
  step: 1,
  phoneNumber: "",
  email: "",
  fullName: "",
  specialization: "",
  doctor: "",
  date: "",
  time: "",
  appointments: [],
  error: null,
};

const appReducer = (state = initialState, action: any): AppState => {
  switch (action.type) {
    case SET_FIELD:
      return { ...state, [action.field]: action.value };
    case SET_APPOINTMENTS:
      return { ...state, appointments: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };
    case RESET:
      return initialState;
    default:
      return state;
  }
};

export default appReducer;