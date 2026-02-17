import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { checkIn, checkOut, fetchTodayStatus } from "../features/attendance/attendanceSlice";
import { StatusBadge } from "../components/StatusBadge";

export function MarkAttendancePage() {
  const dispatch = useDispatch();
  const { today, loading, error } = useSelector((state) => state.attendance);
  const [time, setTime] = useState(dayjs());

  useEffect(() => {
    dispatch(fetchTodayStatus());
  }, [dispatch]);

  useEffect(() => {
    const id = setInterval(() => setTime(dayjs()), 1000);
    return () => clearInterval(id);
  }, []);

  const checkedIn = Boolean(today?.checkInTime);
  const checkedOut = Boolean(today?.checkOutTime);

  return (
    <div className="mark-shell">
      <div className="mark-card">
        {/* Live clock */}
        <div className="mark-clock">
          <span className="mark-time">{time.format("HH:mm:ss")}</span>
          <span className="mark-date">{time.format("dddd, MMMM D, YYYY")}</span>
        </div>

        {/* Status info */}
        <div className="mark-info">
          <div className="mark-info-item">
            <span className="mark-info-label">Status</span>
            <StatusBadge status={today?.status || "absent"} />
          </div>
          <div className="mark-info-item">
            <span className="mark-info-label">Check In</span>
            <span className="mark-info-value">
              {today?.checkInTime ? dayjs(today.checkInTime).format("hh:mm:ss A") : "--:--:--"}
            </span>
          </div>
          <div className="mark-info-item">
            <span className="mark-info-label">Check Out</span>
            <span className="mark-info-value">
              {today?.checkOutTime ? dayjs(today.checkOutTime).format("hh:mm:ss A") : "--:--:--"}
            </span>
          </div>
        </div>

        {error && <p className="mark-error">{error}</p>}

        {/* Action buttons */}
        <div className="mark-actions">
          <button
            className={"mark-btn mark-btn-in" + (loading ? " mark-btn-disabled" : "")}
            disabled={loading}
            onClick={() => dispatch(checkIn())}
          >
            <span className="mark-btn-icon">&#x2714;</span>
            Check In
          </button>
          <button
            className={"mark-btn mark-btn-out" + (loading ? " mark-btn-disabled" : "")}
            disabled={loading}
            onClick={() => dispatch(checkOut())}
          >
            <span className="mark-btn-icon">&#x2716;</span>
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
}
