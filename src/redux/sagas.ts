import { takeEvery, put, call, select, CallEffect, SelectEffect, PutEffect, SagaReturnType } from "redux-saga/effects";
import axios, { AxiosResponse } from "axios";
import { API_BASE_URL } from "../env";
import {
  FETCH_APPOINTMENTS,
  CREATE_APPOINTMENT,
  UPDATE_APPOINTMENT_STATUS,
  setAppointments,
  setError,
  setField,
  setCreatingAppointment, resetState
} from "../redux/actions";
import { AppState, Appointment } from "../types";

type FetchAppointmentsResponse = AxiosResponse<Appointment[]>;
type CreateAppointmentResponse = AxiosResponse<Appointment>;
type UpdateAppointmentResponse = AxiosResponse<void>;

const getPhoneNumber = (state: { app: AppState }) => state.app.phoneNumber;

const fetchAppointments = (phoneNumber: string): Promise<FetchAppointmentsResponse> =>
    axios.get<Appointment[]>(`${API_BASE_URL}/appointments`, {
      headers: { patient_phone_number: phoneNumber },
      params: { phoneNumber },
    });

const createAppointmentRequest = (data: any, phoneNumber: string): Promise<CreateAppointmentResponse> =>
    axios.post<Appointment>(`${API_BASE_URL}/appointments`, data, {
      headers: { patient_phone_number: phoneNumber },
    });

const updateAppointmentStatusRequest = (appointmentId: number, status: string, phoneNumber: string): Promise<UpdateAppointmentResponse> =>
    axios.patch<void>(`${API_BASE_URL}/appointments/${appointmentId}`, { status }, {
      headers: { patient_phone_number: phoneNumber },
    });

function* fetchAppointmentsSaga(): Generator<SelectEffect | CallEffect | PutEffect, void, any> {
  try {
    const phoneNumber: SagaReturnType<typeof select> = yield select(getPhoneNumber);
    const response: FetchAppointmentsResponse = yield call(fetchAppointments as (...args: any[]) => Promise<FetchAppointmentsResponse>, phoneNumber);
    yield put(setAppointments(response.data));
  } catch (error: any) {
    yield put(setError(error.message));
  }
}

function* createAppointmentSaga(action: any): Generator<CallEffect | PutEffect, void, CreateAppointmentResponse> {
  try {
    yield put(setCreatingAppointment(true));
    // Ánh xạ dữ liệu để khớp với định dạng API mong đợi
    const apiData = {
      patientName: action.payload.patientName,
      phoneNumber: action.payload.phoneNumber,
      email: action.payload.email,
      appointmentDate: action.payload.appointmentDate,
      appointmentTime: action.payload.appointmentTime,
      doctorId: 1,
      checkupType: action.payload.doctorSpecialization,
      additionalNotes: action.payload.additionalNotes,
    };

    const response: CreateAppointmentResponse = yield call(
        createAppointmentRequest as (...args: any[]) => Promise<CreateAppointmentResponse>,
        apiData,
        action.payload.phoneNumber
    );
    yield call(fetchAppointmentsSaga);
    yield put(resetState()); // Reset state nhưng giữ phoneNumber
    yield put(setField("step", 5)); // Chuyển sang trang Appointments
    yield put(setCreatingAppointment(false)); // Kết thúc tạo cuộc hẹn
  } catch (error: any) {
    yield put(setError(error.message));
    yield put(setCreatingAppointment(false));
  }
}

function* updateAppointmentStatusSaga(action: any): Generator<SelectEffect | CallEffect | PutEffect, void, any> {
  try {
    const phoneNumber: SagaReturnType<typeof select> = yield select(getPhoneNumber);
    yield call(
        updateAppointmentStatusRequest as (...args: any[]) => Promise<UpdateAppointmentResponse>,
        action.payload.appointmentId,
        action.payload.status,
        phoneNumber
    );
    yield call(fetchAppointmentsSaga);
  } catch (error: any) {
    yield put(setError(error.message));
  }
}

export default function* rootSaga(): Generator<any, void, unknown> {
  yield takeEvery(FETCH_APPOINTMENTS, fetchAppointmentsSaga);
  yield takeEvery(CREATE_APPOINTMENT, createAppointmentSaga);
  yield takeEvery(UPDATE_APPOINTMENT_STATUS, updateAppointmentStatusSaga);
}