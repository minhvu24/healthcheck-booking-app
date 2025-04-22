import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../types";
import { setField } from "../redux/actions";

const Step1 = () => {
  const dispatch = useDispatch();
  const { fullName, phoneNumber, email } = useSelector((state: { app: AppState }) => state.app);

  return (
      <div>
        <h2>Step 1: Personal Information</h2>
        <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => dispatch(setField("fullName", e.target.value))}
        />
        <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => dispatch(setField("phoneNumber", e.target.value))}
            disabled
        />
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => dispatch(setField("email", e.target.value))}
        />
      </div>
  );
};

export default Step1;