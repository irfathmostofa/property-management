import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Home,
  Trees,
  Users,
  CreditCard,
  Bell,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Buildings", href: "/buildings", icon: Building2 },
  { name: "Apartments", href: "/apartments", icon: Home },
  { name: "Cottages", href: "/cottages", icon: Trees },
  { name: "Renters", href: "/renters", icon: Users },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Reports", href: "/reports", icon: FileText },
];

const adminNavigation = [
  { name: "Admin Panel", href: "/admin", icon: Settings },
];

export function Sidebar() {
  const { signOut, isAdmin } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary-600">Rent Manager</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100",
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <div className="my-4 border-t border-gray-200" />
              {adminNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-700 hover:bg-gray-100",
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* Sign Out */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
