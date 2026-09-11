import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Tags,
  Menu,
  X,
  LogOut,
  Store,
  ChevronRight,
} from "lucide-react";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    label: "All Sweets",
    path: "/admin/categories",
    icon: Tags,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: Users,
  },
];

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const adminUser = JSON.parse(
    localStorage.getItem("adminUser") || "{}"
  );

  const handleLogout = () => {
    setLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    setLogoutModalOpen(false);
    setSidebarOpen(false);

    navigate("/admin/login", {
      replace: true,
    });
  };

  const cancelLogout = () => {
    setLogoutModalOpen(false);
  };

  const closeSidebarOnMobile = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f4f1] text-[#241a1c]">
      {/* =====================================================
          MOBILE SIDEBAR OVERLAY
      ====================================================== */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebarOnMobile}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#eadfda] bg-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* -------------------------------------------------
            SIDEBAR HEADER
        -------------------------------------------------- */}
        <div className="flex h-20 items-center justify-between border-b border-[#eadfda] px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#40134f] text-white">
              <Store size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-[#241a1c]">
                NMB Admin
              </h1>

              <p className="text-xs text-[#81747b]">
                Management Panel
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeSidebarOnMobile}
            className="rounded-lg p-2 text-[#81747b] transition hover:bg-[#f7f4f1] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* -------------------------------------------------
            NAVIGATION
        -------------------------------------------------- */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#a1959b]">
            Main Menu
          </p>

          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebarOnMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#40134f] text-white shadow-sm"
                        : "text-[#655961] hover:bg-[#f7f4f1] hover:text-[#40134f]"
                    }`
                  }
                >
                  <Icon size={19} />

                  <span>{item.label}</span>

                  <ChevronRight
                    size={16}
                    className="ml-auto opacity-50"
                  />
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* -------------------------------------------------
            SIDEBAR FOOTER
        -------------------------------------------------- */}
        <div className="border-t border-[#eadfda] p-4">
          {/* Admin User */}
          <div className="mb-3 rounded-xl bg-[#f7f4f1] px-4 py-3">
            <p className="truncate text-sm font-semibold text-[#241a1c]">
              {adminUser.name ||
                adminUser.email ||
                "NMB Admin"}
            </p>

            <p className="truncate text-xs text-[#81747b]">
              {adminUser.email || "Administrator"}
            </p>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={19} />

            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <div className="lg:pl-72">
        {/* -------------------------------------------------
            HEADER
        -------------------------------------------------- */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#eadfda] bg-[#f7f4f1]/95 px-5 backdrop-blur md:px-8">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl bg-white p-2.5 text-[#40134f] shadow-sm transition hover:bg-[#faf8f6] lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div>
              <p className="text-sm text-[#81747b]">
                Narayan Misthan Bhandar
              </p>

              <h2 className="text-lg font-bold text-[#241a1c]">
                Admin Panel
              </h2>
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden items-center gap-3 sm:flex">
            {/* Avatar */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eadcf0] font-bold text-[#40134f]">
              {(adminUser.name ||
                adminUser.email ||
                "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            {/* Admin Info */}
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-[#241a1c]">
                {adminUser.name || "Administrator"}
              </p>

              <p className="text-xs text-[#81747b]">
                Store Manager
              </p>
            </div>
          </div>
        </header>

        {/* -------------------------------------------------
            PAGE CONTENT
        -------------------------------------------------- */}
        <main className="p-5 md:p-8">
          {children}
        </main>
      </div>

      {/* =====================================================
          LOGOUT CONFIRMATION MODAL
      ====================================================== */}
      {logoutModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              cancelLogout();
            }
          }}
        >
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Content */}
            <div className="p-6">
              {/* Icon */}
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <LogOut
                  size={22}
                  className="text-red-600"
                />
              </div>

              {/* Heading */}
              <h3 className="text-lg font-bold text-[#241a1c]">
                Logout
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm leading-6 text-[#81747b]">
                Are you sure you want to logout from the
                admin panel?
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 border-t border-[#eadfda] bg-[#fcfaf8] p-5">
              {/* No */}
              <button
                type="button"
                onClick={cancelLogout}
                className="flex-1 rounded-xl border border-[#eadfda] bg-white px-4 py-3 text-sm font-semibold text-[#655961] transition hover:bg-[#f7f4f1]"
              >
                No
              </button>

              {/* Yes */}
              <button
                type="button"
                onClick={confirmLogout}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;