import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authSlice";

export function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "", employeeId: "", department: "Engineering" });

  useEffect(() => {
    if (user?.role === "employee") navigate("/employee/dashboard");
  }, [user, navigate]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form));
  };

  return (
    <div className="auth-shell">
      <div className="auth-wrap">
        <aside className="auth-side" style={{ backgroundImage: "url('/Images/Image1.jpg')" }}>
          <div>
            <img src="/Images/app logo.png" alt="Logo" className="auth-logo" />
            <div className="auth-brand">Employee Attendance System</div>
            <h1>Create Account</h1>
            <p>Register as an employee and start tracking your attendance from day one.</p>
            <ul>
              <li>Simple onboarding</li>
              <li>Personal dashboard with stats</li>
              <li>Monthly attendance visibility</li>
            </ul>
          </div>
          <p>Employee registration portal</p>
        </aside>
        <div className="auth-card">
          <h2 className="section-title">Employee Register</h2>
          <p className="muted">Create your account to start daily attendance tracking.</p>
          <form onSubmit={onSubmit} className="grid">
            <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
            <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
            <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} />
            <input className="input" placeholder="Employee ID (e.g. EMP009)" value={form.employeeId} onChange={(e) => setForm((s) => ({ ...s, employeeId: e.target.value }))} />
            <input className="input" placeholder="Department" value={form.department} onChange={(e) => setForm((s) => ({ ...s, department: e.target.value }))} />
            {error && <p className="error-text">{error}</p>}
            <button className="btn" disabled={loading}>{loading ? "Creating..." : "Register"}</button>
          </form>
          <div className="auth-links">
            <Link className="auth-link" to="/">Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
