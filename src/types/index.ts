export interface Appointment {
  appointmentId: number;
  patientName?: string;
  phoneNumber?: string;
  email?: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorName: string;
  doctorSpecialization: string;
  status: string;
  additionalNotes?: string;
  date?: string;
  time?: string;
}

export interface AppState {
  step: number;
  phoneNumber: string;
  email: string;
  fullName: string;
  specialization: string;
  doctor: string;
  date: string;
  time: string;
  appointments: Appointment[];
  error: string | null;
  appointmentDetail: Appointment | null;
  isCreatingAppointment: boolean;
  page: number;
  size: number;
  totalItems: number;
}

export interface FetchAppointmentsResponse {
  appointments: Appointment[];
  page: number;
  size: number;
  totalItems: number;
}