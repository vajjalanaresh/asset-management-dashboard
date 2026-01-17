import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { useUIStore } from "../../stores/uiStore";

const linkClass = "block px-4 py-2 rounded-md text-sm font-medium transition";

const inactiveClass = "text-gray-300 hover:bg-gray-700 hover:text-white";

const activeClass = "bg-gray-800 text-white";

export default function Sidebar() {
  const { sidebarOpen, closeSidebar } = useUIStore();

  return (
    <>
      {/* Overlay (mobile only) */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static z-40
          top-0 left-0 h-full
          w-64 bg-gray-900
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between text-xl font-bold text-white">
          Asset Dashboard
          {/* Close button (mobile) */}
          <button
            onClick={closeSidebar}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 space-y-1 px-2">
          <NavLink
            to="/dashboard"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/customers"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            Customers
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
