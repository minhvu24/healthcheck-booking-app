import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../types";
import { setField } from "../redux/actions";

const Step2 = () => {
  const dispatch = useDispatch();
  const { specialization, doctor } = useSelector((state: { app: AppState }) => state.app);

  const specializations = ["General", "Cardiology", "Neurology"];
  const doctors = {
    General: ["Dr. Smith", "Dr. Jones"],
    Cardiology: ["Dr. Brown", "Dr. Taylor"],
    Neurology: ["Dr. Wilson", "Dr. Davis"],
  };

  return (
      <div>
        <h2>Step 2: Appointment Information</h2>
        <select
            value={specialization}
            onChange={(e) => dispatch(setField("specialization", e.target.value))}
        >
          <option value="">Select Specialization</option>
          {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
          ))}
        </select>
        {specialization && (
            <select
                value={doctor}
                onChange={(e) => dispatch(setField("doctor", e.target.value))}
            >
              <option value="">Select Doctor</option>
              {doctors[specialization as keyof typeof doctors].map((doc) => (
                  <option key={doc} value={doc}>
                    {doc}
                  </option>
              ))}
            </select>
        )}
      </div>
  );
};

export default Step2;