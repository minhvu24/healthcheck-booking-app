import { AppState } from "../types";
import {
  SET_FIELD,
  SET_APPOINTMENTS,
  SET_ERROR,
  SET_APPOINTMENT_DETAIL,
  RESET_STATE
} from "../redux/actions";

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
  appointmentDetail: null,
  isCreatingAppointment: false,
};

const appReducer = (state = initialState, action: any): AppState => {
  console.log("Action received in reducer:", action); // Thêm log
  switch (action.type) {
    case SET_FIELD:
      if (!action?.field || action.value === undefined) {
        console.warn("Invalid SET_FIELD action:", action);
        return state;
      }
      return { ...state, [action.field]: action.value };
    case SET_APPOINTMENTS: {
      const appointments = action.payload?.appointments || action.payload || [];
      return {...state, appointments};
    }
    case SET_ERROR:
      return { ...state, error: action.payload };
    case SET_APPOINTMENT_DETAIL:
      return { ...state, appointmentDetail: action.payload };
    case RESET_STATE:
      return {
        ...initialState,
        phoneNumber: state.phoneNumber,
        appointments: state.appointments,
        appointmentDetail: state.appointmentDetail,
      };
    default:
      return state;
  }
};

export default appReducer;