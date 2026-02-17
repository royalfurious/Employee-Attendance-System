import { useEffect } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { checkIn, checkOut, fetchTodayStatus } from "../features/attendance/attendanceSlice";
import { fetchEmployeeDashboard } from "../features/dashboard/dashboardSlice";
import { StatusBadge } from "../components/StatusBadge";

export function EmployeeDashboardPage() {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard.employee);
  const { today } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(fetchEmployeeDashboard());
    dispatch(fetchTodayStatus());
  }, [dispatch]);

  const onCheckIn = async () => {
    await dispatch(checkIn());
    dispatch(fetchEmployeeDashboard());
  };

  const onCheckOut = async () => {
    await dispatch(checkOut());
    dispatch(fetchEmployeeDashboard());
  };

  return (
    <div className="grid">
      <div className="title-block">
        <h2 className="section-title">Employee Dashboard</h2>
        <p className="section-subtitle">Quick view of today activity and monthly performance.</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Today Status</span>
          <p>
            <StatusBadge status={today?.status || dashboard?.todayStatus?.status || "absent"} />
          </p>
          <div className="row">
            <button className="btn" onClick={onCheckIn}>Quick Check In</button>
            <button className="btn btn-outline" onClick={onCheckOut}>Quick Check Out</button>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">This Month</span>
          <span className="stat-value">{dashboard?.monthStats?.present || 0}</span>
          <span className="stat-note">Present Days</span>
          <span className="muted">Absent: {dashboard?.monthStats?.absent || 0} | Late: {dashboard?.monthStats?.late || 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Hours This Month</span>
          <span className="stat-value">{dashboard?.monthStats?.totalHours || 0}</span>
          <span className="stat-note">Hours worked</span>
        </div>
      </div>
      <div className="card">
        <h3 className="section-title">Recent Attendance (Last 7 days)</h3>
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
            {(dashboard?.recentAttendance || []).map((item) => (
              <tr key={item._id}>
                <td>{dayjs(item.date).format("YYYY-MM-DD")}</td>
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
