import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAttendance } from "../features/attendance/attendanceSlice";
import client from "../api/client";

export function ReportsPage() {
  const dispatch = useDispatch();
  const rows = useSelector((state) => state.attendance.allAttendance);
  const [filters, setFilters] = useState({ startDate: "", endDate: "", employeeId: "" });

  useEffect(() => {
    dispatch(fetchAllAttendance({}));
  }, [dispatch]);

  const filteredRows = useMemo(() => {
    return rows.filter((item) => {
      const d = dayjs(item.date);
      const passStart = !filters.startDate || d.isAfter(dayjs(filters.startDate).subtract(1, "day"));
      const passEnd = !filters.endDate || d.isBefore(dayjs(filters.endDate).add(1, "day"));
      const passEmp = !filters.employeeId || item.userId?.employeeId?.toLowerCase().includes(filters.employeeId.toLowerCase());
      return passStart && passEnd && passEmp;
    });
  }, [rows, filters]);

  const onExport = async () => {
    const params = {};
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.employeeId) params.employeeId = filters.employeeId;

    const response = await client.get("/attendance/export", {
      params,
      responseType: "blob",
    });

    const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", "attendance-report.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  };

  return (
    <div className="grid">
      <h2 className="section-title">Reports</h2>
      <div className="card grid grid-3">
        <input className="input" type="date" value={filters.startDate} onChange={(e) => setFilters((s) => ({ ...s, startDate: e.target.value }))} />
        <input className="input" type="date" value={filters.endDate} onChange={(e) => setFilters((s) => ({ ...s, endDate: e.target.value }))} />
        <input className="input" placeholder="Employee ID or All" value={filters.employeeId} onChange={(e) => setFilters((s) => ({ ...s, employeeId: e.target.value }))} />
      </div>

      <div className="row">
        <button className="btn" onClick={onExport}>Export CSV</button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Employee</th>
              <th>Department</th>
              <th>Status</th>
              <th>Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((item) => (
              <tr key={item._id}>
                <td>{dayjs(item.date).format("YYYY-MM-DD")}</td>
                <td>{item.userId?.name} ({item.userId?.employeeId})</td>
                <td>{item.userId?.department}</td>
                <td>{item.status}</td>
                <td>{item.totalHours || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
