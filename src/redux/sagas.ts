import { takeEvery, put, call, select, CallEffect, SelectEffect, PutEffect, SagaReturnType } from "redux-saga/effects";
import axios, { AxiosResponse } from "axios";
import { API_BASE_URL } from "../env";
import { FETCH_APPOINTMENTS, CREATE_APPOINTMENT, UPDATE_APPOINTMENT_STATUS, setAppointments, setError, setField } from "../redux/actions";
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
    console.log("Fetching appointments for phoneNumber:", phoneNumber);
    const response: FetchAppointmentsResponse = yield call(fetchAppointments as (...args: any[]) => Promise<FetchAppointmentsResponse>, phoneNumber);
    console.log("Fetch appointments response:", response.data);
    yield put(setAppointments(response.data));
  } catch (error: any) {
    console.error("Error fetching appointments:", error.message);
    if (error.response?.status === 404) {
      yield put(setAppointments([])); // Đặt appointments thành mảng rỗng nếu không tìm thấy
    } else {
      yield put(setError(error.message));
    }
  }
}

function* createAppointmentSaga(action: any): Generator<CallEffect | PutEffect, void, CreateAppointmentResponse> {
  try {
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
    console.log("Created appointment:", response.data);
    yield call(fetchAppointmentsSaga);
    yield put(setField("step", 5));
  } catch (error: any) {
    console.error("Error creating appointment:", error.message);
    yield put(setError(error.message));
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
    console.error("Error updating appointment status:", error.message);
    yield put(setError(error.message));
  }
}

export default function* rootSaga(): Generator<any, void, unknown> {
  yield takeEvery(FETCH_APPOINTMENTS, fetchAppointmentsSaga);
  yield takeEvery(CREATE_APPOINTMENT, createAppointmentSaga);
  yield takeEvery(UPDATE_APPOINTMENT_STATUS, updateAppointmentStatusSaga);
}