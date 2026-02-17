import { useSelector } from "react-redux";

export function ProfilePage() {
  const user = useSelector((state) => state.auth.user);
  const firstLetter = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="grid profile-shell">
      <div className="title-block">
        <h2 className="section-title">Profile</h2>
        <p className="section-subtitle">Your account and role details.</p>
      </div>
      <div className="profile-card">
        <div className="profile-top">
          <span className="profile-avatar">{firstLetter}</span>
          <div>
            <h3 className="section-title" style={{ marginBottom: 2 }}>{user?.name}</h3>
            <p className="muted" style={{ textTransform: "capitalize" }}>{user?.role}</p>
          </div>
        </div>
        <div className="profile-grid">
          <div className="profile-item"><span>Name</span><strong>{user?.name}</strong></div>
          <div className="profile-item"><span>Email</span><strong>{user?.email}</strong></div>
          <div className="profile-item"><span>Role</span><strong style={{ textTransform: "capitalize" }}>{user?.role}</strong></div>
          <div className="profile-item"><span>Employee ID</span><strong>{user?.employeeId}</strong></div>
          <div className="profile-item"><span>Department</span><strong>{user?.department}</strong></div>
        </div>
      </div>
    </div>
  );
}
