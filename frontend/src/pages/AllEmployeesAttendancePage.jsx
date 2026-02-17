import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAttendance } from "../features/attendance/attendanceSlice";
import { StatusBadge } from "../components/StatusBadge";

export function AllEmployeesAttendancePage() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.attendance.allAttendance);
  const [filters, setFilters] = useState({ employeeId: "", date: "", status: "" });

  useEffect(() => {
    dispatch(fetchAllAttendance(filters));
  }, [dispatch, filters]);

  return (
    <div className="grid">
      <div className="title-block">
        <h2 className="section-title">All Employees Attendance</h2>
        <p className="section-subtitle">Filter records by employee, date, and attendance status.</p>
      </div>
      <div className="filter-card grid grid-3">
        <input className="input" placeholder="Filter by employee ID" value={filters.employeeId} onChange={(e) => setFilters((s) => ({ ...s, employeeId: e.target.value }))} />
        <input className="input" type="date" value={filters.date} onChange={(e) => setFilters((s) => ({ ...s, date: e.target.value }))} />
        <select value={filters.status} onChange={(e) => setFilters((s) => ({ ...s, status: e.target.value }))}>
          <option value="">All Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
          <option value="half-day">Half Day</option>
        </select>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Employee</th>
              <th>Department</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
              <th>Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                <td>{dayjs(item.date).format("YYYY-MM-DD")}</td>
                <td>{item.userId?.name} ({item.userId?.employeeId})</td>
                <td>{item.userId?.department}</td>
                <td>{item.checkInTime ? dayjs(item.checkInTime).format("HH:mm") : "-"}</td>
                <td>{item.checkOutTime ? dayjs(item.checkOutTime).format("HH:mm") : "-"}</td>
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
