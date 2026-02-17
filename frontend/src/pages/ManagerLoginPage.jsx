import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";

export function ManagerLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user?.role === "manager") navigate("/manager/dashboard");
    if (user?.role === "employee") navigate("/employee/dashboard");
  }, [user, navigate]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="auth-shell">
      <div className="auth-wrap">
        <aside className="auth-side" style={{ backgroundImage: "url('/Images/image2.jpeg')" }}>
          <div>
            <img src="/Images/app logo.png" alt="Logo" className="auth-logo" />
            <div className="auth-brand">Employee Attendance System</div>
            <h1>Manager Console</h1>
            <p>Monitor attendance activity across teams, track trends, and export reports quickly.</p>
            <ul>
              <li>Live team attendance dashboard</li>
              <li>Department-wise insights</li>
              <li>CSV report export</li>
            </ul>
          </div>
          <p>Manager portal access</p>
        </aside>
        <div className="auth-card">
          <h2 className="section-title">Manager Login</h2>
          <p className="muted">Sign in to monitor team attendance and reports.</p>
          <form onSubmit={onSubmit} className="grid">
            <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
            <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} />
            {error && <p className="error-text">{error}</p>}
            <button className="btn" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
          </form>
          <div className="auth-links">
            <Link className="auth-link" to="/">Employee login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
