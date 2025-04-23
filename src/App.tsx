import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

  const [localPhoneNumber, setLocalPhoneNumber] = useState("");
  const [currentStep, setCurrentStep] = useState(step || 1);
  const [isStep1Valid, setIsStep1Valid] = useState(false);
  const [isStep2Valid, setIsStep2Valid] = useState(false);
  const [isStep3Valid, setIsStep3Valid] = useState(false);

  useEffect(() => {
    if (phoneNumber) {
      dispatch(fetchAppointments());
    }
  }, [phoneNumber, dispatch]);

  useEffect(() => {
    setCurrentStep(step || 1);
  }, [step]);

  const handleSubmit = () => {
    const appointmentData = {
      patientName: fullName,
      phoneNumber,
      email,
      appointmentDate: date, // Ánh xạ date thành appointmentDate
      appointmentTime: time, // Ánh xạ time thành appointmentTime
      doctorName: doctor, // Sử dụng giá trị từ state.doctor (tên bác sĩ)
      doctorSpecialization: specialization, // Sử dụng giá trị từ state.specialization
      additionalNotes: "First-time visit",
    };
    dispatch(createAppointment(appointmentData));
    dispatch(setField("step", 5));
    setCurrentStep(5);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalPhoneNumber(e.target.value);
  };

  const handlePhoneNumberSubmit = () => {
    const cleanedPhoneNumber = localPhoneNumber.replace(/\D/g, "");
    if (cleanedPhoneNumber.length >= 10) {
      dispatch(setField("phoneNumber", localPhoneNumber));
      dispatch(setField("step", 1));
    } else {
      alert("Please enter a valid phone number (at least 10 digits).");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePhoneNumberSubmit();
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      dispatch(setField("step", newStep));
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      dispatch(setField("step", newStep));
    }
  };

  const steps = [
    {
      name: "Step One",
      component: <Step1 onValidationChange={(isValid: boolean) => setIsStep1Valid(isValid)} />,
    },
    {
      name: "Step Two",
      component: <Step2 onValidationChange={(isValid: boolean) => setIsStep2Valid(isValid)} />,
    },
    {
      name: "Step Three",
      component: <Step3 onValidationChange={(isValid: boolean) => setIsStep3Valid(isValid)} />,
    },
    { name: "Step Four", component: <Step4 /> },
  ];

  const isNextDisabled = () => {
    if (currentStep === 4) return true;
    if (currentStep === 1) return !isStep1Valid;
    if (currentStep === 2) return !isStep2Valid;
    if (currentStep === 3) return !isStep3Valid;
    return false;
  };

  return (
      <>
        {!phoneNumber ? (
            <div className="phone-entry">
              <h1>Enter Phone Number</h1>
              <input
                  type="text"
                  placeholder="Phone Number"
                  value={localPhoneNumber}
                  onChange={handlePhoneNumberChange}
                  onKeyDown={handleKeyDown}
              />
              <button onClick={handlePhoneNumberSubmit}>Enter</button>
            </div>
        ) : (
            <div className="app-container">
              <Navbar />
              {error && <div className="error">{error}</div>}
              {step <= 4 ? (
                  <div className="step-wrapper">
                    <div className="step-progress">
                      {steps.map((stepItem, index) => (
                          <div key={index} className="step-item">
                            <div className="step-label-container">
                      <span className={`step-label ${currentStep >= index + 1 ? "active" : ""}`}>
                        {stepItem.name}
                      </span>
                              <div className={`step-circle ${currentStep >= index + 1 ? "active" : ""}`}>
                                {index + 1}
                              </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`step-line ${currentStep > index + 1 ? "active" : ""}`} />
                            )}
                          </div>
                      ))}
                    </div>

                    <div className="step-content">
                      {currentStep >= 1 && currentStep <= steps.length ? (
                          <>
                            {steps[currentStep - 1].component}
                            {currentStep === 4 && (
                                <button onClick={handleSubmit} className="submit-btn">
                                  Submit
                                </button>
                            )}
                          </>
                      ) : (
                          <div>Invalid step</div>
                      )}
                    </div>

                    {currentStep <= 4 && (
                        <div className="step-buttons">
                          <button
                              onClick={handlePrevStep}
                              disabled={currentStep === 1}
                              className="prev-btn"
                          >
                            Prev
                          </button>
                          <button
                              onClick={handleNextStep}
                              disabled={isNextDisabled()}
                              className="next-btn"
                          >
                            Next
                          </button>
                        </div>
                    )}
                  </div>
              ) : (
                  <Appointments />
              )}
            </div>
        )}
      </>
  );
};

export default App;