import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../types";
import { setField } from "../redux/actions";
import { useState, useEffect } from "react";
import "../styles/step1.scss";
import "../styles/main.scss"
interface Step1Props {
  onValidationChange: (isValid: boolean) => void;
}

const Step1: React.FC<Step1Props> = ({ onValidationChange }) => {
  const dispatch = useDispatch();
  const { fullName, phoneNumber, email } = useSelector((state: { app: AppState }) => state.app);

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateFullName = (value: string) => {
    if (!value.trim()) {
      setFullNameError("Full Name is required");
    } else {
      setFullNameError("");
    }
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setEmailError("Email is required");
    } else if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setField("fullName", value));
    validateFullName(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setField("email", value));
    validateEmail(value);
  };

  const handleFullNameBlur = () => {
    validateFullName(fullName);
  };

  const handleEmailBlur = () => {
    validateEmail(email);
  };

  // Tính toán trạng thái hợp lệ của form
  useEffect(() => {
    const isFormValid =
        fullName.trim() !== "" && email.trim() !== "" && emailRegex.test(email);
    onValidationChange(isFormValid);
  }, [fullName, email, onValidationChange]);

  return (
      <div className="step1-container">
        <h2>Step 1: Personal Information</h2>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
              type="text"
              id="fullName"
              placeholder="Full Name"
              value={fullName}
              onChange={handleFullNameChange}
              onBlur={handleFullNameBlur}
              className={`form-input ${fullNameError ? "error" : ""}`}
          />
          {fullNameError && <span className="error-message">{fullNameError}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
              type="text"
              id="phoneNumber"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => dispatch(setField("phoneNumber", e.target.value))}
              disabled
              className="form-input disabled"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              className={`form-input ${emailError ? "error" : ""}`}
          />
          {emailError && <span className="error-message">{emailError}</span>}
        </div>
      </div>
  );
};

export default Step1;