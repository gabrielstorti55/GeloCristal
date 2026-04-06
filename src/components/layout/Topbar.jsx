export default function Topbar({ title, dateLabel }) {
  return (
    <div className="topbar">
      <span className="topbar-title">{title}</span>
      <span className="topbar-date">{dateLabel}</span>
    </div>
  );
}
