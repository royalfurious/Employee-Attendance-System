export function StatusBadge({ status }) {
  const normalized = status || "absent";
  return <span className={`badge ${normalized}`}>{normalized}</span>;
}
