import { useSelector } from "react-redux";
import { AppState } from "../types";

const Step4 = () => {
  const { fullName, phoneNumber, email, specialization, doctor, date, time } = useSelector(
      (state: { app: AppState }) => state.app
  );

  return (
      <div>
        <h2>Step 4: Appointment Confirmation</h2>
        <div>
          <h3>Personal Information</h3>
          <p>Full Name: {fullName}</p>
          <p>Phone Number: {phoneNumber}</p>
          <p>Email: {email}</p>
        </div>
        <div>
          <h3>Appointment Information</h3>
          <p>Specialization: {specialization}</p>
          <p>Doctor: {doctor}</p>
        </div>
        <div>
          <h3>Timeslot</h3>
          <p>Date: {date}</p>
          <p>Time: {time}</p>
        </div>
      </div>
  );
};

export default Step4;