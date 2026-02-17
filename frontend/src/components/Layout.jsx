import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export function Layout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onLogout = () => {
    dispatch(logout());
    setOpenMenu(false);
    navigate("/");
  };

  const onOpenProfile = () => {
    if (user?.role === "employee") {
      navigate("/employee/profile");
    } else {
      navigate("/manager/profile");
    }
    setOpenMenu(false);
  };

  const avatarLetter = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <div>
      <nav className="nav">
        <div className="nav-brand">
          <img src="/Images/app logo.png" alt="Logo" className="nav-logo" />
          <strong>Attendance System</strong>
        </div>
        <div className="nav-links">
          {user?.role === "employee" && (
            <>
              <Link to="/employee/dashboard">Dashboard</Link>
              <Link to="/employee/mark">Mark Attendance</Link>
              <Link to="/employee/history">My History</Link>
            </>
          )}
          {user?.role === "manager" && (
            <>
              <Link to="/manager/dashboard">Dashboard</Link>
              <Link to="/manager/attendance">All Attendance</Link>
              <Link to="/manager/calendar">Team Calendar</Link>
              <Link to="/manager/reports">Reports</Link>
            </>
          )}
        </div>
        <div className="nav-user" ref={menuRef}>
          <button
            className="avatar-btn"
            onClick={() => setOpenMenu((value) => !value)}
            aria-label="Open profile menu"
          >
            <span className="avatar-circle">{avatarLetter}</span>
          </button>

          {openMenu && (
            <div className="user-dropdown">
              <p className="dropdown-user">{user?.name}</p>
              <p className="dropdown-role">{user?.role}</p>
              <button className="dropdown-btn" onClick={onOpenProfile}>
                Profile
              </button>
              <button className="dropdown-btn danger" onClick={onLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      <main className="container">{children}</main>
    </div>
  );
}
