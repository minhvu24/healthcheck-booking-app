import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState, Appointment } from "../types";
import { setField, updateAppointmentStatus, fetchAppointments } from "../redux/actions";
import "../styles/appointments.scss";

const Appointments = () => {
  const dispatch = useDispatch();
  const appointments = useSelector((state: { app: AppState }) => state.app.appointments);
  const phoneNumber = useSelector((state: { app: AppState }) => state.app.phoneNumber);
  const error = useSelector((state: { app: AppState }) => state.app.error);
  const page = useSelector((state: { app: AppState }) => state.app.page);
  const totalItems = useSelector((state: { app: AppState }) => state.app.totalItems);
  console.log("Redux state:", { page, totalItems, phoneNumber });

  const [searchPhone, setSearchPhone] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState(appointments);

  useEffect(() => {
    if (phoneNumber && !searchPhone) {
      console.log("Fetching appointments with page:", page, "size:", 10);
      dispatch(fetchAppointments(page, 10));
    }
  }, [phoneNumber, dispatch, page, searchPhone]);

  useEffect(() => {
    console.log("Appointments in state:", appointments);
    setFilteredAppointments(appointments);
  }, [appointments]);

  const handleEditFromTable = (appointment: Appointment) => {
    dispatch(setField("fullName", appointment.patientName || ""));
    dispatch(setField("email", appointment.email || ""));
    dispatch(setField("specialization", appointment.doctorSpecialization || ""));
    dispatch(setField("doctor", appointment.doctorName || ""));
    dispatch(setField("date", appointment.appointmentDate));
    dispatch(setField("time", appointment.appointmentTime));
    dispatch(setField("step", 1));
  };

  const handleCancel = (appointmentId: number) => {
    dispatch(updateAppointmentStatus(appointmentId, "cancelled"));
  };

  const handleSearch = () => {
    if (searchPhone.trim() === "") {
      dispatch(fetchAppointments(1, 10));
    } else {
      dispatch(fetchAppointments(1, 10, searchPhone.trim()));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (newPage: number) => {
    console.log("Attempting to change to page:", newPage, "totalPages:", totalPages);
    if (newPage >= 1 && newPage <= totalPages) {
      console.log("Changing to page:", newPage, "size:", 10);
      dispatch(fetchAppointments(newPage, 10, searchPhone || undefined));
    } else {
      console.log("Page change blocked: newPage out of bounds");
    }
  };

  const validSize = 10; // Thay đổi thành 10
  const validTotalItems = typeof totalItems === "number" ? totalItems : 0;
  const totalPages = Math.ceil(validTotalItems / validSize) || 1;
  console.log("Pagination info:", { page, size: validSize, totalItems, totalPages });

  return (
      <div className="appointments-container">
        <h2>My Appointments</h2>

        {error && <div className="error-message">{error}</div>}

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
          {searchPhone && (
              <button
                  onClick={() => {
                    setSearchPhone("");
                    dispatch(fetchAppointments(1, 10));
                  }}
                  className="reset-btn"
              >
                Reset
              </button>
          )}
        </div>

        {Array.isArray(filteredAppointments) && filteredAppointments.length === 0 ? (
            <p>No appointments found.</p>
        ) : Array.isArray(filteredAppointments) ? (
            <>
              <div className="table-wrapper">
                <table className="appointment-table">
                  <thead>
                  <tr>
                    <th className="date-col">Date</th>
                    <th className="time-col">Time</th>
                    <th className="doctor-col">Doctor</th>
                    <th className="status-col">Status</th>
                    <th className="actions-col">Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {filteredAppointments.map((appointment) => (
                      <tr key={appointment.appointmentId}>
                        <td className="date-col">{appointment.date}</td>
                        <td className="time-col">{appointment.time}</td>
                        <td className="doctor-col">{appointment.doctorName}</td>
                        <td className="status-col">{appointment.status}</td>
                        <td className="actions-col">
                          <div className="actions">
                            {appointment.status !== "completed" &&
                                appointment.status !== "cancelled" && (
                                    <>
                                      <button
                                          onClick={() => handleEditFromTable(appointment)}
                                          className="edit-btn"
                                      >
                                        Edit
                                      </button>
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

              <div className="pagination">
                 <span>
              Page {page} of {totalPages} (Total: {validTotalItems} appointments)
            </span>
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="pagination-btn"
                >
                  Previous
                </button>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="pagination-btn"
                >
                  Next
                </button>
              </div>
            </>
        ) : (
            <p>Error: Appointments data is not in the expected format.</p>
        )}
      </div>
  );
};

export default Appointments;