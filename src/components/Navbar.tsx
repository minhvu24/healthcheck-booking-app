import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../types";
import { setField, reset } from "../redux/actions";

const Navbar = () => {
  const dispatch = useDispatch();
  const phoneNumber = useSelector((state: { app: AppState }) => state.app.phoneNumber);

  const handleLogout = () => {
    dispatch(reset());
  };

  return (
      <div className="navbar">
        {phoneNumber && (
            <>
              <button onClick={() => dispatch(setField("step", 1))}>Make Appointment</button>
              <button onClick={() => dispatch(setField("step", 5))}>View My Appointments</button>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
        )}
      </div>
  );
};

export default Navbar;