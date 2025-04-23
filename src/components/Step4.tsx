import { useSelector } from "react-redux";
import { AppState } from "../types";
import "../styles/step4.scss";
import "../styles/main.scss"
const Step4 = () => {
  const { fullName, phoneNumber, email, specialization, doctor, date, time } = useSelector(
      (state: { app: AppState }) => state.app
  );

  return (
      <div className="step4-container">
        <h2>Step 4: Appointment Confirmation</h2>
        <div className="info-section">
          <h3>Personal Information</h3>
          <p><span className="info-label">Full Name:</span> {fullName}</p>
          <p><span className="info-label">Phone Number:</span> {phoneNumber}</p>
          <p><span className="info-label">Email:</span> {email}</p>
        </div>
        <div className="info-section">
          <h3>Appointment Information</h3>
          <p><span className="info-label">Specialization:</span> {specialization}</p>
          <p><span className="info-label">Doctor:</span> {doctor}</p>
        </div>
        <div className="info-section">
          <h3>Timeslot</h3>
          <p><span className="info-label">Date:</span> {date}</p>
          <p><span className="info-label">Time:</span> {time}</p>
        </div>
      </div>
  );
};

export default Step4;