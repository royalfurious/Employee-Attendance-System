import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAttendance } from "../features/attendance/attendanceSlice";

export function TeamCalendarPage() {
  const dispatch = useDispatch();
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const records = useSelector((state) => state.attendance.allAttendance);

  useEffect(() => {
    dispatch(fetchAllAttendance({}));
  }, [dispatch]);

  const dataByDate = useMemo(() => {
    const map = new Map();
    records.forEach((r) => {
      const key = dayjs(r.date).format("YYYY-MM-DD");
      const current = map.get(key) || { present: 0, late: 0, halfDay: 0, absent: 0 };
      if (r.status === "present") current.present += 1;
      if (r.status === "late") current.late += 1;
      if (r.status === "half-day") current.halfDay += 1;
      if (r.status === "absent") current.absent += 1;
      map.set(key, current);
    });
    return map;
  }, [records]);

  const monthObj = dayjs(month + "-01");
  const daysInMonth = monthObj.daysInMonth();

  return (
    <div className="grid">
      <div className="calendar-toolbar">
        <div className="title-block">
          <h2 className="section-title">Team Calendar View</h2>
          <p className="section-subtitle">Daily snapshot of Present, Late, Half Day, and Absent counts.</p>
        </div>
        <input className="input" style={{ maxWidth: 230 }} type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
      </div>
      <div className="legend">
        <span className="legend-item"><span className="dot present" />Present</span>
        <span className="legend-item"><span className="dot late" />Late</span>
        <span className="legend-item"><span className="dot half-day" />Half Day</span>
        <span className="legend-item"><span className="dot absent" />Absent</span>
      </div>
      <div className="card">
        <div className="calendar-grid">
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = monthObj.date(day).format("YYYY-MM-DD");
            const stat = dataByDate.get(date);
            const isWeekend = monthObj.date(day).day() === 0 || monthObj.date(day).day() === 6;
            return (
              <div key={date} className={`day-cell ${isWeekend ? "weekend" : ""}`}>
                <div className="day-head">
                  <span className="day-num">{day}</span>
                  <span className="day-week">{monthObj.date(day).format("ddd")}</span>
                </div>
                <div className="metric-line"><span className="metric-key">Present</span><span className="metric-value">{stat?.present || 0}</span></div>
                <div className="metric-line"><span className="metric-key">Late</span><span className="metric-value">{stat?.late || 0}</span></div>
                <div className="metric-line"><span className="metric-key">Half Day</span><span className="metric-value">{stat?.halfDay || 0}</span></div>
                <div className="metric-line"><span className="metric-key">Absent</span><span className="metric-value">{stat?.absent || 0}</span></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
