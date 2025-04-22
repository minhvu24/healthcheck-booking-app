import { takeEvery, put, call, select, CallEffect, SelectEffect, PutEffect, SagaReturnType } from "redux-saga/effects";
import axios, { AxiosResponse } from "axios";
import { API_BASE_URL } from "../env";
import { FETCH_APPOINTMENTS, CREATE_APPOINTMENT, UPDATE_APPOINTMENT_STATUS, setAppointments, setError, setField } from "../redux/actions";
import { AppState, Appointment } from "../types";

// Định nghĩa kiểu cho các giá trị trả về của axios
type FetchAppointmentsResponse = AxiosResponse<Appointment[]>;
type CreateAppointmentResponse = AxiosResponse<Appointment>;
type UpdateAppointmentResponse = AxiosResponse<void>;

// Selector để lấy phoneNumber
const getPhoneNumber = (state: { app: AppState }) => state.app.phoneNumber;

// Hàm wrapper cho axios.get
const fetchAppointments = (phoneNumber: string): Promise<FetchAppointmentsResponse> =>
    axios.get<Appointment[]>(`${API_BASE_URL}/appointments`, {
      headers: { patient_phone_number: phoneNumber },
      params: { phoneNumber },
    });

// Hàm wrapper cho axios.post
const createAppointmentRequest = (data: any, phoneNumber: string): Promise<CreateAppointmentResponse> =>
    axios.post<Appointment>(`${API_BASE_URL}/appointments`, data, {
      headers: { patient_phone_number: phoneNumber },
    });

// Hàm wrapper cho axios.patch
const updateAppointmentStatusRequest = (appointmentId: number, status: string, phoneNumber: string): Promise<UpdateAppointmentResponse> =>
    axios.patch<void>(`${API_BASE_URL}/appointments/${appointmentId}`, { status }, {
      headers: { patient_phone_number: phoneNumber },
    });

// Saga để lấy danh sách appointments
function* fetchAppointmentsSaga(): Generator<SelectEffect | CallEffect | PutEffect, void, any> {
  try {
    const phoneNumber: SagaReturnType<typeof select> = yield select(getPhoneNumber);
    const response: FetchAppointmentsResponse = yield call(fetchAppointments as (...args: any[]) => Promise<FetchAppointmentsResponse>, phoneNumber);
    yield put(setAppointments(response.data));
  } catch (error: any) {
    yield put(setError(error.message));
  }
}

// Saga để tạo appointment
function* createAppointmentSaga(action: any): Generator<CallEffect | PutEffect, void, CreateAppointmentResponse> {
  try {
    const response: CreateAppointmentResponse = yield call(
        createAppointmentRequest as (...args: any[]) => Promise<CreateAppointmentResponse>,
        action.payload,
        action.payload.phoneNumber
    );
    yield call(fetchAppointmentsSaga);
    yield put(setField("step", 5)); // Chuyển sang bước "View My Appointments" sau khi tạo thành công
  } catch (error: any) {
    yield put(setError(error.message));
  }
}

// Saga để cập nhật trạng thái appointment
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

// Root saga
export default function* rootSaga(): Generator<any, void, unknown> {
  yield takeEvery(FETCH_APPOINTMENTS, fetchAppointmentsSaga);
  yield takeEvery(CREATE_APPOINTMENT, createAppointmentSaga);
  yield takeEvery(UPDATE_APPOINTMENT_STATUS, updateAppointmentStatusSaga);
}