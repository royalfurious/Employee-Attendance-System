import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { fetchManagerDashboard } from "../features/dashboard/dashboardSlice";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#9333ea"];

export function ManagerDashboardPage() {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard.manager);

  useEffect(() => {
    dispatch(fetchManagerDashboard());
  }, [dispatch]);

  return (
    <div className="grid">
      <div className="title-block">
        <h2 className="section-title">Manager Dashboard</h2>
        <p className="section-subtitle">Track overall team attendance and trends at a glance.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Employees</span>
          <span className="stat-value">{dashboard?.totalEmployees || 0}</span>
          <span className="stat-note">Active members</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Today Present</span>
          <span className="stat-value">{dashboard?.today?.present || 0}</span>
          <span className="stat-note">Checked in today</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Today Absent</span>
          <span className="stat-value">{dashboard?.today?.absent || 0}</span>
          <span className="stat-note">Not marked today</span>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card" style={{ height: 320 }}>
          <h3 className="section-title">Weekly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={dashboard?.weeklyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#16a34a" />
              <Bar dataKey="absent" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ height: 320 }}>
          <h3 className="section-title">Department-wise Attendance</h3>
          {(dashboard?.departmentWise || []).length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center", marginTop: 40 }}>No department data</p>
          ) : (
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={dashboard.departmentWise} margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#2563eb" name="Total" />
                <Bar dataKey="present" fill="#16a34a" name="Present Today" />
                <Bar dataKey="absent" fill="#dc2626" name="Absent Today" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Absent Employees Today</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Employee ID</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {(dashboard?.absentEmployees || []).map((emp) => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.employeeId}</td>
                <td>{emp.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
