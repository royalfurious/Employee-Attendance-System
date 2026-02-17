import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, loginUser } from "../features/auth/authSlice";

export function EmployeeLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user?.role === "employee") navigate("/employee/dashboard");
    if (user?.role === "manager") navigate("/manager/dashboard");
  }, [user, navigate]);

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="auth-shell">
      <div className="auth-wrap">
        <aside className="auth-side" style={{ backgroundImage: "url('/Images/Image1.jpg')" }}>
          <div>
            <img src="/Images/app logo.png" alt="Logo" className="auth-logo" />
            <div className="auth-brand">Employee Attendance System</div>
            <h1>Welcome Back</h1>
            <p>Track daily attendance, review your monthly summary, and stay on top of your work hours.</p>
            <ul>
              <li>Quick check-in and check-out</li>
              <li>Monthly status summary</li>
              <li>Attendance calendar history</li>
            </ul>
          </div>
          <p>Employee portal access</p>
        </aside>
        <div className="auth-card">
          <h2 className="section-title">Employee Login</h2>
          <p className="muted">Sign in to mark attendance and view your dashboard.</p>
          <form onSubmit={onSubmit} className="grid">
            <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
            <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} />
            {error && <p className="error-text">{error}</p>}
            <button className="btn" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
          </form>
          <div className="auth-links">
            <Link className="auth-link" to="/register">Create employee account</Link>
            <Link className="auth-link" to="/manager/login">Manager login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
