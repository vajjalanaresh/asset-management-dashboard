import { ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUIStore } from "../../stores/uiStore";

export default function Topbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth0();
  const { toggleSidebar } = useUIStore();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <header className="h-16 bg-white border-b flex items-center px-6">
        <span className="text-sm text-gray-400">Loading user…</span>
      </header>
    );
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* Left: Mobile Sidebar Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        <h1 className="hidden sm:block text-lg font-semibold text-gray-800">
          Asset Dashboard
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        {/* <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button> */}

        {/* User Menu */}
        {isAuthenticated && user && (
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-xl"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.name?.charAt(0) || "U"
                )}
              </div>

              <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                {user.name || user.email}
              </span>

              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>

                <button
                  onClick={() => {
                    setOpen(false);
                    logout({
                      logoutParams: {
                        returnTo: window.location.origin,
                      },
                    });
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
