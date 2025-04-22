import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../types";
import { setField } from "../redux/actions";

const Step3 = () => {
  const dispatch = useDispatch();
  const { date, time } = useSelector((state: { app: AppState }) => state.app);

  const times = ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"];

  return (
      <div>
        <h2>Step 3: Select Timeslot</h2>
        <input
            type="date"
            value={date}
            onChange={(e) => dispatch(setField("date", e.target.value))}
        />
        <select
            value={time}
            onChange={(e) => dispatch(setField("time", e.target.value))}
        >
          <option value="">Select Time</option>
          {times.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
          ))}
        </select>
      </div>
  );
};

export default Step3;