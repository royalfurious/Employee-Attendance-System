import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyHistory, fetchMySummary } from "../features/attendance/attendanceSlice";
import { StatusBadge } from "../components/StatusBadge";

export function MyAttendanceHistoryPage() {
  const dispatch = useDispatch();
  const { myHistory, mySummary } = useSelector((state) => state.attendance);
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));

  useEffect(() => {
    const [year, monthNum] = month.split("-");
    dispatch(fetchMyHistory({ year, month: monthNum }));
    dispatch(fetchMySummary({ year, month: monthNum }));
  }, [dispatch, month]);

  const dayMap = useMemo(() => {
    const map = new Map();
    myHistory.forEach((item) => map.set(dayjs(item.date).format("YYYY-MM-DD"), item));
    return map;
  }, [myHistory]);

  const daysInMonth = dayjs(month + "-01").daysInMonth();
  const yearMonth = dayjs(month + "-01");

  return (
    <div className="grid">
      <div className="row-between">
        <h2 className="section-title">My Attendance History</h2>
        <input className="input" style={{ maxWidth: 180 }} type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
      </div>

      <div className="grid grid-3">
        <div className="card">Present: {mySummary?.summary?.present || 0}</div>
        <div className="card">Absent: {mySummary?.summary?.absent || 0}</div>
        <div className="card">Late: {mySummary?.summary?.late || 0}</div>
      </div>

      <div className="card">
        <h3 className="section-title">Calendar View</h3>
        <div className="calendar-grid">
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const date = yearMonth.date(day).format("YYYY-MM-DD");
            const item = dayMap.get(date);
            const status = item?.status;
            const statusClass = status || "";
            return (
              <div key={date} className={`day-cell ${statusClass}`}>
                <strong>{day}</strong>
                <div style={{ marginTop: 6 }}>
                  {item ? <StatusBadge status={item.status} /> : <span>-</span>}
                </div>
                {item?.checkInTime && <small>In: {dayjs(item.checkInTime).format("HH:mm")}</small>}
                {item?.checkOutTime && <small> Out: {dayjs(item.checkOutTime).format("HH:mm")}</small>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Table View</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
              <th>Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {myHistory.map((item) => (
              <tr key={item._id}>
                <td>{dayjs(item.date).format("YYYY-MM-DD")}</td>
                <td>{item.checkInTime ? dayjs(item.checkInTime).format("HH:mm:ss") : "-"}</td>
                <td>{item.checkOutTime ? dayjs(item.checkOutTime).format("HH:mm:ss") : "-"}</td>
                <td><StatusBadge status={item.status} /></td>
                <td>{item.totalHours || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
