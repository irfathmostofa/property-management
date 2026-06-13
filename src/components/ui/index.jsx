import { X, AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react";
import { cn, getStatusColor, capitalize } from "../../lib/utils";
import { useEffect } from "react";

// ── Card ──────────────────────────────────────────────────────
export function Card({ children, className, noPad = false, ...props }) {
  return (
    <div className={cn("card", noPad && "card--no-pad", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, actions, icon }) {
  return (
    <div className="card-header">
      <div className="card-header-left">
        {icon && <span className="card-header-icon">{icon}</span>}
        <div>
          <h3 className="card-title">{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="card-header-actions">{actions}</div>}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────
export function Badge({ status, label, size = "md" }) {
  const colorClass = getStatusColor(status || label?.toLowerCase());
  return (
    <span className={cn("badge", colorClass, size === "sm" && "badge-sm")}>
      <span className="badge-dot" />
      {label || capitalize(status)}
    </span>
  );
}

// ── Stat Card ─────────────────────────────────────────────────
export function StatCard({ title, value, sub, icon, color = "blue", trend }) {
  return (
    <div className={cn("stat-card", `stat-card--${color}`)}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-body">
        <p className="stat-label">{title}</p>
        <p className="stat-value">{value}</p>
        {sub && <p className="stat-sub">{sub}</p>}
      </div>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = "md" }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={cn("modal", `modal--${size}`)}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

// ── Confirm Dialog ────────────────────────────────────────────
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  danger = true,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="confirm-message">{message}</p>
      <div className="confirm-actions">
        <button className="btn btn-secondary btn-md" onClick={onClose}>
          Cancel
        </button>
        <button
          className={cn("btn btn-md", danger ? "btn-danger" : "btn-primary")}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
}

// ── Table ─────────────────────────────────────────────────────
export function Table({
  columns,
  data,
  loading,
  emptyMessage = "No records found.",
}) {
  if (loading) return <TableSkeleton cols={columns.length} />;
  if (!data?.length) return <Empty message={emptyMessage} />;

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={col.align ? `text-${col.align}` : ""}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={col.align ? `text-${col.align}` : ""}
                >
                  {col.render ? col.render(row) : (row[col.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableSkeleton({ cols }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: cols }).map((_, j) => (
                <td key={j}>
                  <div className="skeleton skeleton-text" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Empty ─────────────────────────────────────────────────────
export function Empty({ message, action }) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Info size={32} />
      </div>
      <p className="empty-message">{message}</p>
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
}

// ── Alert ─────────────────────────────────────────────────────
const alertIcons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
};

export function Alert({ type = "info", title, message }) {
  const Icon = alertIcons[type] || Info;
  return (
    <div className={cn("alert", `alert--${type}`)}>
      <Icon size={18} />
      <div>
        {title && <p className="alert-title">{title}</p>}
        <p className="alert-message">{message}</p>
      </div>
    </div>
  );
}

// ── Divider ───────────────────────────────────────────────────
export function Divider({ label }) {
  return (
    <div className="divider">
      {label && <span className="divider-label">{label}</span>}
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────
export function Spinner({ size = 32 }) {
  return (
    <div className="spinner-wrap" style={{ height: size * 3 }}>
      <div className="spinner" style={{ width: size, height: size }} />
    </div>
  );
}

// ── Page Header ───────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions, back }) {
  return (
    <div className="page-header">
      <div className="page-header-left">
        {back && (
          <button className="btn btn-ghost btn-sm page-back" onClick={back}>
            ← Back
          </button>
        )}
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={cn("tab", active === tab.value && "tab--active")}
          onClick={() => onChange(tab.value)}
        >
          {tab.icon && <span className="tab-icon">{tab.icon}</span>}
          {tab.label}
          {tab.count != null && <span className="tab-count">{tab.count}</span>}
        </button>
      ))}
    </div>
  );
}
