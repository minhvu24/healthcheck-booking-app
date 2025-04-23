import { Appointment } from "../types";

// Action Types
export const SET_FIELD = "SET_FIELD";
export const SET_APPOINTMENTS = "SET_APPOINTMENTS";
export const SET_ERROR = "SET_ERROR";
export const RESET = "RESET";
export const FETCH_APPOINTMENTS = "FETCH_APPOINTMENTS";
export const CREATE_APPOINTMENT = "CREATE_APPOINTMENT";
export const UPDATE_APPOINTMENT_STATUS = "UPDATE_APPOINTMENT_STATUS";
export const FETCH_APPOINTMENT_DETAIL = "FETCH_APPOINTMENT_DETAIL";
export const SET_APPOINTMENT_DETAIL = "SET_APPOINTMENT_DETAIL";

// Action Creators
export const setField = (field: string, value: any) => ({
  type: SET_FIELD,
  field,
  value,
});

export const reset = () => ({ type: RESET });

export const setAppointments = (appointments: Appointment[]) => ({
  type: SET_APPOINTMENTS,
  payload: appointments,
});

export const setError = (error: string | null) => ({
  type: SET_ERROR,
  payload: error,
});

export const fetchAppointments = () => ({ type: FETCH_APPOINTMENTS });

export const createAppointment = (appointmentData: Omit<Appointment, "appointmentId" | "status">) => ({
  type: CREATE_APPOINTMENT,
  payload: appointmentData,
});

export const updateAppointmentStatus = (appointmentId: number, status: Appointment["status"]) => ({
  type: UPDATE_APPOINTMENT_STATUS,
  payload: { appointmentId, status },
});

export const fetchAppointmentDetail = (appointmentId: number) => ({
  type: FETCH_APPOINTMENT_DETAIL,
  payload: { appointmentId },
});

export const setAppointmentDetail = (appointment: Appointment) => ({
  type: SET_APPOINTMENT_DETAIL,
  payload: appointment,
});