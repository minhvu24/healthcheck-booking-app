import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactMultiStep from "react-multistep";
import { AppState } from "./types";
import { fetchAppointments, setField, createAppointment } from "./redux/actions";
import Navbar from "./components/Navbar";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import Appointments from "./components/Appointments";
import "./styles/main.scss";

const App = () => {
  const dispatch = useDispatch();
  const { phoneNumber, email, fullName, specialization, doctor, date, time, step, error } = useSelector(
      (state: { app: AppState }) => state.app
  );

  useEffect(() => {
    if (phoneNumber) {
      dispatch(fetchAppointments());
    }
  }, [phoneNumber, dispatch]);

  const handleSubmit = () => {
    const appointmentData = {
      patientName: fullName,
      phoneNumber,
      email,
      appointmentDate: date,
      appointmentTime: time,
      doctorId: 1, // Mock doctorId
      checkupType: specialization,
      additionalNotes: "First-time visit",
    };
    dispatch(createAppointment(appointmentData));
  };

  // Định nghĩa các bước cho ReactMultiStep
  const steps = [
    {
      name: "Personal Information",
      component: <Step1 />,
    },
    {
      name: "Appointment Information",
      component: <Step2 />,
    },
    {
      name: "Select Timeslot",
      component: <Step3 />,
    },
    {
      name: "Appointment Confirmation",
      component: (
          <>
            <Step4 />
            <button onClick={handleSubmit} className="submit-btn">
              Submit
            </button>
          </>
      ),
    },
  ];

  if (!phoneNumber) {
    return (
        <div className="phone-entry">
          <h1>Enter Phone Number</h1>
          <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => dispatch(setField("phoneNumber", e.target.value))}
          />
          <button onClick={() => dispatch(setField("step", 1))}>Enter</button>
        </div>
    );
  }

  return (
      <div className="app-container">
        <Navbar />
        {error && <div className="error">{error}</div>}
        {step <= 4 ? (
            <ReactMultiStep steps={steps} />
        ) : (
            <Appointments />
        )}
      </div>
  );
};

export default App;