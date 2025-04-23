import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../types";
import { setField } from "../redux/actions";
import { useState, useEffect } from "react";
import "../styles/step3.scss";
import "../styles/main.scss"

interface Step3Props {
  onValidationChange: (isValid: boolean) => void;
}

const Step3: React.FC<Step3Props> = ({ onValidationChange }) => {
  const dispatch = useDispatch();
  const { date, time } = useSelector((state: { app: AppState }) => state.app);

  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");

  const generateTimeSlots = (startHour: number, endHour: number) => {
    const times: string[] = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      const formattedHour = hour.toString().padStart(2, "0");
      times.push(`${formattedHour}:00`);
    }
    return times;
  };

  const times = generateTimeSlots(8, 17);

  const validateDate = (value: string) => {
    if (!value) {
      setDateError("Date is required");
    } else {
      setDateError("");
    }
  };

  const validateTime = (value: string) => {
    if (!value) {
      setTimeError("Time is required");
    } else {
      setTimeError("");
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setField("date", value));
    validateDate(value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    dispatch(setField("time", value));
    validateTime(value);
  };

  const handleDateBlur = () => {
    validateDate(date);
  };

  const handleTimeBlur = () => {
    validateTime(time);
  };

  useEffect(() => {
    const isFormValid = date !== "" && time !== "";
    onValidationChange(isFormValid);
  }, [date, time, onValidationChange]);

  return (
      <div className="step3-container">
        <h2>Step 3: Select Timeslot</h2>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
              type="date"
              id="date"
              value={date}
              onChange={handleDateChange}
              onBlur={handleDateBlur}
              className={`form-input ${dateError ? "error" : ""}`}
          />
          {dateError && <span className="error-message">{dateError}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="time">Time</label>
          <select
              id="time"
              value={time}
              onChange={handleTimeChange}
              onBlur={handleTimeBlur}
              className={`form-select ${timeError ? "error" : ""}`}
          >
            <option value="">Select Time</option>
            {times.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
            ))}
          </select>
          {timeError && <span className="error-message">{timeError}</span>}
        </div>
      </div>
  );
};

export default Step3;