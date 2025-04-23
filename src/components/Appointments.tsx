import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState, Appointment } from "../types";
import { setField, updateAppointmentStatus, fetchAppointmentDetail, fetchAppointments } from "../redux/actions";
import "../styles/appointments.scss"

const Appointments = () => {
  const dispatch = useDispatch();
  const appointments = useSelector((state: { app: AppState }) => state.app.appointments);
  const phoneNumber = useSelector((state: { app: AppState }) => state.app.phoneNumber);
  const appointmentDetail = useSelector((state: { app: AppState }) => state.app.appointmentDetail);
  const [searchPhone, setSearchPhone] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState(appointments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasFetched, setHasFetched] = useState(false); // Thêm biến trạng thái

  useEffect(() => {
    if (phoneNumber && !hasFetched) {
      console.log("Fetching appointments on mount");
      dispatch(fetchAppointments());
      setHasFetched(true); // Đánh dấu đã gọi API
    }
  }, [phoneNumber, dispatch, hasFetched]);

  useEffect(() => {
    console.log("Appointments in state:", appointments);
    setFilteredAppointments(appointments);
  }, [appointments]);



  const handleEditFromModal = () => {
    if (appointmentDetail) {
      dispatch(setField("fullName", appointmentDetail.patientName || ""));
      dispatch(setField("phoneNumber", appointmentDetail.phoneNumber || ""));
      dispatch(setField("email", appointmentDetail.email || ""));
      dispatch(setField("date", appointmentDetail.appointmentDate || ""));
      dispatch(setField("time", appointmentDetail.appointmentTime || ""));
      dispatch(setField("specialization", appointmentDetail.doctorSpecialization || ""));
      dispatch(setField("doctor", appointmentDetail.doctorName || ""));
      dispatch(setField("step", 1));
    }
    setIsModalOpen(false);
  };

  const handleCancel = (appointmentId: number) => {
    dispatch(updateAppointmentStatus(appointmentId, "cancelled"));
  };

  const handleDetail = (appointmentId: number) => {
    dispatch(fetchAppointmentDetail(appointmentId));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = () => {
    if (searchPhone.trim() === "") {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter((appointment) =>
          appointment.phoneNumber?.includes(searchPhone.trim())
      );
      setFilteredAppointments(filtered);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
      <div className="appointments-container">
        <h2>My Appointments</h2>

        <div className="search-section">
          <input
              type="text"
              placeholder="Search by phone number"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              onKeyDown={handleKeyDown}
              className="search-input"
          />
          <button onClick={handleSearch} className="search-btn">
            Search
          </button>
        </div>

        {Array.isArray(filteredAppointments) && filteredAppointments.length === 0 ? (
            <p>No appointments found.</p>
        ) : Array.isArray(filteredAppointments) ? (
            <div className="table-wrapper">
              <table className="appointment-table">
                <thead>
                <tr>
                  <th className="date-col">Date</th>
                  <th className="time-col">Time</th>
                  <th className="doctor-col">Doctor</th>
                  <th className="specialization-col">Specialization</th>
                  <th className="status-col">Status</th>
                  <th className="actions-col">Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredAppointments.map((appointment) => (
                    <tr key={appointment.appointmentId}>
                      {/*<td className="date-col">{appointment.appointmentDate}</td>*/}
                      {/*<td className="time-col">{appointment.appointmentTime}</td>*/}
                      <td className="doctor-col">{appointment.doctorName}</td>
                      <td className="specialization-col">{appointment.doctorSpecialization}</td>
                      <td className="status-col">{appointment.status}</td>
                      <td className="actions-col">
                        <div className="actions">
                          <button onClick={() => handleDetail(appointment.appointmentId)} className="detail-btn">
                            Detail
                          </button>
                          {appointment.status !== "completed" && appointment.status !== "cancelled" && (
                              <>
                                <button
                                    onClick={() => handleCancel(appointment.appointmentId)}
                                    className="cancel-btn"
                                >
                                  Cancel
                                </button>
                              </>
                          )}
                        </div>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        ) : (
            <p>Error: Appointments data is not in the expected format.</p>
        )}

        {isModalOpen && appointmentDetail && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Appointment Details</h3>
                <div className="modal-body">
                  <p><strong>Patient Name:</strong> {appointmentDetail.patientName}</p>
                  <p><strong>Phone Number:</strong> {appointmentDetail.phoneNumber}</p>
                  <p><strong>Email:</strong> {appointmentDetail.email}</p>
                  <p><strong>Date:</strong> {appointmentDetail.appointmentDate}</p>
                  <p><strong>Time:</strong> {appointmentDetail.appointmentTime}</p>
                  <p><strong>Doctor:</strong> {appointmentDetail.doctorName}</p>
                  <p><strong>Specialization:</strong> {appointmentDetail.doctorSpecialization}</p>
                  <p><strong>Status:</strong> {appointmentDetail.status}</p>
                  <p><strong>Additional Notes:</strong> {appointmentDetail.additionalNotes || "N/A"}</p>
                </div>
                <div className="modal-footer">
                  {appointmentDetail.status !== "completed" && appointmentDetail.status !== "cancelled" && (
                      <button onClick={handleEditFromModal} className="edit-modal-btn">
                        Edit
                      </button>
                  )}
                  <button onClick={handleCloseModal} className="close-btn">
                    Close
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default Appointments;