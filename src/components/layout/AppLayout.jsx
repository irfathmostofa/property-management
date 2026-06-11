import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  BedDouble,
  Users,
  CreditCard,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/index.jsx";

const ownerNav = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Buildings", icon: Building2, to: "/buildings" },
  { label: "Apartments", icon: Home, to: "/apartments" },
  { label: "Cottages", icon: BedDouble, to: "/cottages" },
  { label: "Renters", icon: Users, to: "/renters" },
  { label: "Payments", icon: CreditCard, to: "/payments" },
  { label: "Notifications", icon: Bell, to: "/notifications" },
  { label: "Reports", icon: BarChart3, to: "/reports" },
];

const adminNav = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "All Owners", icon: Shield, to: "/admin/owners" },
  { label: "All Buildings", icon: Building2, to: "/admin/buildings" },
  { label: "All Renters", icon: Users, to: "/admin/renters" },
  { label: "All Payments", icon: CreditCard, to: "/admin/payments" },
  { label: "Reports", icon: BarChart3, to: "/reports" },
];

const sidebarStyles = `
  .layout { display: flex; min-height: 100vh; }

  .sidebar {
    background: var(--color-sidebar-bg);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    transition: width 0.22s cubic-bezier(.4,0,.2,1);
    position: fixed;
    left: 0; top: 0; bottom: 0;
    z-index: 100;
    overflow: hidden;
  }
  .sidebar-expanded  { width: var(--sidebar-width); }
  .sidebar-collapsed { width: var(--sidebar-collapsed); }

  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    flex-shrink: 0;
    overflow: hidden;
  }
  .sidebar-logo-mark {
    width: 32px; height: 32px;
    background: var(--color-primary);
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 700;
    color: #fff;
  }
  .sidebar-logo-text {
    font-family: var(--font-display);
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    white-space: nowrap;
  }
  .sidebar-logo-sub {
    font-size: 10px;
    color: var(--color-sidebar-text);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
    line-height: 1;
  }

  .sidebar-nav {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 12px 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .sidebar-nav::-webkit-scrollbar { width: 0; }

  .sidebar-section-label {
    font-size: 10px;
    font-weight: 600;
    color: rgba(148,163,184,0.5);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 10px 10px 4px;
    white-space: nowrap;
    overflow: hidden;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 10px;
    border-radius: var(--radius-md);
    color: var(--color-sidebar-text);
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-decoration: none;
    transition: background 0.12s, color 0.12s;
    flex-shrink: 0;
  }
  .nav-link:hover {
    background: var(--color-sidebar-hover);
    color: #fff;
  }
  .nav-link.active {
    background: rgba(20,184,166,0.15);
    color: var(--color-sidebar-active);
  }
  .nav-link.active .nav-icon { color: var(--color-sidebar-active); }
  .nav-icon { flex-shrink: 0; }
  .nav-label { flex: 1; overflow: hidden; text-overflow: ellipsis; }

  .sidebar-footer {
    border-top: 1px solid rgba(255,255,255,0.07);
    padding: 12px 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex-shrink: 0;
  }
  .sidebar-user {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: var(--radius-md);
    overflow: hidden;
  }
  .sidebar-user-info { overflow: hidden; flex: 1; }
  .sidebar-user-name {
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sidebar-user-role {
    font-size: 11px;
    color: var(--color-sidebar-text);
    white-space: nowrap;
  }

  .sidebar-toggle {
    position: fixed;
    left: var(--sidebar-width);
    top: 22px;
    width: 22px; height: 22px;
    background: var(--color-sidebar-bg);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: var(--color-sidebar-text);
    cursor: pointer;
    transition: left 0.22s cubic-bezier(.4,0,.2,1), color 0.1s;
    z-index: 101;
  }
  .sidebar-toggle:hover { color: #fff; }
  .sidebar-toggle.collapsed { left: calc(var(--sidebar-collapsed) - 11px); }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    transition: margin-left 0.22s cubic-bezier(.4,0,.2,1);
  }
  .main-content-expanded  { margin-left: var(--sidebar-width); }
  .main-content-collapsed { margin-left: var(--sidebar-collapsed); }

  .topbar {
    height: 56px;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 12px;
    position: sticky;
    top: 0;
    z-index: 50;
    flex-shrink: 0;
  }
  .topbar-title {
    font-family: var(--font-display);
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text-primary);
    flex: 1;
  }
  .topbar-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .page-content {
    flex: 1;
    padding: 24px;
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
  }
`;

export function AppLayout({ children, title }) {
  const { profile, signOut, isAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const nav = isAdmin ? adminNav : ownerNav;

  return (
    <>
      <style>{sidebarStyles}</style>
      <div className="layout">
        {/* Sidebar */}
        <aside
          className={`sidebar ${collapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}
        >
          <div className="sidebar-logo">
            <div className="sidebar-logo-mark">RF</div>
            {!collapsed && (
              <div>
                <div className="sidebar-logo-text">RentFlow</div>
                <div className="sidebar-logo-sub">Property Manager</div>
              </div>
            )}
          </div>

          <nav className="sidebar-nav">
            {!collapsed && (
              <div className="sidebar-section-label">
                {isAdmin ? "Admin" : "Management"}
              </div>
            )}
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`
                }
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={18} className="nav-icon" />
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </NavLink>
            ))}

            {!collapsed && (
              <div className="sidebar-section-label" style={{ marginTop: 8 }}>
                Account
              </div>
            )}
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
              title={collapsed ? "Settings" : undefined}
            >
              <Settings size={18} className="nav-icon" />
              {!collapsed && <span className="nav-label">Settings</span>}
            </NavLink>
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-user">
              <Avatar name={profile?.full_name} size="sm" />
              {!collapsed && (
                <div className="sidebar-user-info">
                  <div className="sidebar-user-name">{profile?.full_name}</div>
                  <div className="sidebar-user-role">
                    {profile?.role === "admin"
                      ? "Administrator"
                      : "Property Owner"}
                  </div>
                </div>
              )}
            </div>
            <button
              className="nav-link"
              onClick={signOut}
              title={collapsed ? "Sign Out" : undefined}
            >
              <LogOut size={18} className="nav-icon" />
              {!collapsed && <span className="nav-label">Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Toggle button */}
        <button
          className={`sidebar-toggle ${collapsed ? "collapsed" : ""}`}
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>

        {/* Main */}
        <div
          className={`main-content ${collapsed ? "main-content-collapsed" : "main-content-expanded"}`}
        >
          {title && (
            <div className="topbar">
              <h1 className="topbar-title">{title}</h1>
            </div>
          )}
          <div className="page-content">{children}</div>
        </div>
      </div>
    </>
  );
}
