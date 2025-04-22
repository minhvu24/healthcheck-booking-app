import { useDispatch, useSelector } from "react-redux";
import { AppState, Appointment } from "../types";
import { setField, updateAppointmentStatus } from "../redux/actions";

const Appointments = () => {
  const dispatch = useDispatch();
  const appointments = useSelector((state: { app: AppState }) => state.app.appointments);

  const handleEdit = (appointment: Appointment) => {
    dispatch(setField("fullName", appointment.patientName));
    dispatch(setField("email", appointment.email));
    dispatch(setField("specialization", appointment.checkupType));
    dispatch(setField("doctor", appointment.doctorId.toString()));
    dispatch(setField("date", appointment.appointmentDate));
    dispatch(setField("time", appointment.appointmentTime));
    dispatch(setField("step", 1));
  };

  const handleCancel = (appointmentId: number) => {
    dispatch(updateAppointmentStatus(appointmentId, "cancelled"));
  };

  return (
      <div>
        <h2>My Appointments</h2>
        {appointments.length === 0 ? (
            <p>No appointments found.</p>
        ) : (
            appointments.map((appointment) => (
                <div key={appointment.appointmentId} className="appointment-card">
                  <p>
                    <strong>Date:</strong> {appointment.appointmentDate}
                  </p>
                  <p>
                    <strong>Time:</strong> {appointment.appointmentTime}
                  </p>
                  <p>
                    <strong>Doctor:</strong> {appointment.doctorId}
                  </p>
                  <p>
                    <strong>Status:</strong> {appointment.status}
                  </p>
                  {appointment.status !== "completed" && appointment.status !== "cancelled" && (
                      <div>
                        <button onClick={() => handleEdit(appointment)}>Edit</button>
                        <button onClick={() => handleCancel(appointment.appointmentId)}>Cancel</button>
                      </div>
                  )}
                </div>
            ))
        )}
      </div>
  );
};

export default Appointments;