import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../types";
import { setField } from "../redux/actions";
import { useState, useEffect } from "react";
import "../styles/step2.scss";
import "../styles/main.scss"
interface Step2Props {
  onValidationChange: (isValid: boolean) => void;
}

const Step2: React.FC<Step2Props> = ({ onValidationChange }) => {
  const dispatch = useDispatch();
  const { specialization, doctor } = useSelector((state: { app: AppState }) => state.app);

  const specializations = ["General", "Cardiology", "Neurology"];
  const doctors = {
    General: ["Dr. Smith", "Dr. Jones"],
    Cardiology: ["Dr. Brown", "Dr. Taylor"],
    Neurology: ["Dr. Wilson", "Dr. Davis"],
  };

  const [specializationError, setSpecializationError] = useState("");
  const [doctorError, setDoctorError] = useState("");

  const validateSpecialization = (value: string) => {
    if (!value) {
      setSpecializationError("Specialization is required");
    } else {
      setSpecializationError("");
    }
  };

  const validateDoctor = (value: string) => {
    if (!value) {
      setDoctorError("Doctor is required");
    } else {
      setDoctorError("");
    }
  };

  const handleSpecializationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    dispatch(setField("specialization", value));
    validateSpecialization(value);
    dispatch(setField("doctor", ""));
    setDoctorError("");
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    dispatch(setField("doctor", value));
    validateDoctor(value);
  };

  const handleSpecializationBlur = () => {
    validateSpecialization(specialization);
  };

  const handleDoctorBlur = () => {
    if (specialization) {
      validateDoctor(doctor);
    }
  };

  useEffect(() => {
    const isFormValid = specialization !== "" && doctor !== "";
    onValidationChange(isFormValid);
  }, [specialization, doctor, onValidationChange]);

  return (
      <div className="step2-container">
        <h2>Step 2: Appointment Information</h2>
        <div className="form-group">
          <label htmlFor="specialization">Specialization</label>
          <select
              id="specialization"
              value={specialization}
              onChange={handleSpecializationChange}
              onBlur={handleSpecializationBlur}
              className={`form-select ${specializationError ? "error" : ""}`}
          >
            <option value="">Select Specialization</option>
            {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
            ))}
          </select>
          {specializationError && <span className="error-message">{specializationError}</span>}
        </div>
        {specialization && (
            <div className="form-group">
              <label htmlFor="doctor">Doctor</label>
              <select
                  id="doctor"
                  value={doctor}
                  onChange={handleDoctorChange}
                  onBlur={handleDoctorBlur}
                  className={`form-select ${doctorError ? "error" : ""}`}
              >
                <option value="">Select Doctor</option>
                {doctors[specialization as keyof typeof doctors].map((doc) => (
                    <option key={doc} value={doc}>
                      {doc}
                    </option>
                ))}
              </select>
              {doctorError && <span className="error-message">{doctorError}</span>}
            </div>
        )}
      </div>
  );
};

export default Step2;