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
  setCreatingAppointment,
  resetState,
  setPagination,
} from "../redux/actions";
import { AppState, Appointment, FetchAppointmentsResponse } from "../types";

type FetchAppointmentsResponseType = AxiosResponse<FetchAppointmentsResponse>;
type CreateAppointmentResponse = AxiosResponse<Appointment>;
type UpdateAppointmentResponse = AxiosResponse<void>;

const getPhoneNumber = (state: { app: AppState }) => state.app.phoneNumber;
const getPage = (state: AppState) => state.page;
const getSize = (state: AppState) => state.size;

const fetchAppointments = (phoneNumber: string, page: number, size: number): Promise<FetchAppointmentsResponseType> =>
    axios.get<FetchAppointmentsResponse>(`${API_BASE_URL}/appointments`, {
      headers: { patient_phone_number: phoneNumber },
      params: { phoneNumber, current_page: page, size },
    });

const createAppointmentRequest = (data: any, phoneNumber: string): Promise<CreateAppointmentResponse> =>
    axios.post<Appointment>(`${API_BASE_URL}/appointments`, data, {
      headers: { patient_phone_number: phoneNumber },
    });

const updateAppointmentStatusRequest = (appointmentId: number, status: string, phoneNumber: string): Promise<UpdateAppointmentResponse> =>
    axios.patch<void>(`${API_BASE_URL}/appointments/${appointmentId}`, { status }, {
      headers: { patient_phone_number: phoneNumber },
    });

function* fetchAppointmentsSaga(action: any): Generator<SelectEffect | CallEffect | PutEffect, void, any> {
  try {
    const phoneNumber = yield select(getPhoneNumber);
    const searchPhone = action.payload?.searchPhone || phoneNumber;
    const page = action.payload?.page ?? (yield select(getPage));
    const size =  10;
    const response = yield call(fetchAppointments, searchPhone, page, size);
    yield put(setAppointments(response.data.appointments));
    const paginationData = {
      page: Number(response.data.page) || page,
      size: 10,
      totalItems: Number(response.data.totalItems) || 0,
    };
    yield put(setPagination(paginationData));
  } catch (error: any) {
    if (error.response?.status === 404) {
      yield put(setAppointments([]));
      yield put(setPagination({ page: 1, size: 1, totalItems: 0 }));
    } else {
      yield put(setError(error.message));
      yield put(setAppointments([]));
    }
  }
}


function* createAppointmentSaga(action: any): Generator<CallEffect | PutEffect, void, CreateAppointmentResponse> {
  try {
    yield put(setCreatingAppointment(true));
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
    yield call(fetchAppointmentsSaga, { payload: { page: 1 } });
    yield put(resetState());
    yield put(setField("step", 5));
    yield put(setCreatingAppointment(false));
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
    yield call(fetchAppointmentsSaga, { payload: { page: 1 } });
  } catch (error: any) {
    yield put(setError(error.message));
  }
}

export default function* rootSaga(): Generator<any, void, unknown> {
  yield takeEvery(FETCH_APPOINTMENTS, fetchAppointmentsSaga);
  yield takeEvery(CREATE_APPOINTMENT, createAppointmentSaga);
  yield takeEvery(UPDATE_APPOINTMENT_STATUS, updateAppointmentStatusSaga);
}