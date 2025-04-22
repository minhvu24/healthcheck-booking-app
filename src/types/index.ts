export interface Appointment {
  appointmentId: number;
  patientName: string;
  phoneNumber: string;
  email: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorId: number;
  checkupType: string;
  additionalNotes: string;
  status: "pending" | "rejected" | "approved" | "cancelled" | "completed";
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
}