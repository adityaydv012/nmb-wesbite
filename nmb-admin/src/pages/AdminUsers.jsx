import { useEffect, useMemo, useState } from "react";

import {
  Search,
  RefreshCw,
  Users as UsersIcon,
  User,
  Phone,
  Mail,
  CalendarDays,
  Eye,
  Ban,
  CheckCircle,
  X,
  ShoppingBag,
} from "lucide-react";

import AdminLayout from "../components/admin/AdminLayout";

import {
  getAdminUsers,
  getAdminUserById,
  updateAdminUserStatus,
} from "../services/adminUserApi";


const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const [statusUser, setStatusUser] = useState(null);
  const [changingStatus, setChangingStatus] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // ==========================================
  // LOAD USERS
  // ==========================================

  const loadUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getAdminUsers();

      setUsers(
        Array.isArray(response?.users)
          ? response.users
          : []
      );
    } catch (err) {
      console.error("Load users error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    loadUsers();
  }, []);


  // ==========================================
  // HELPERS
  // ==========================================

  const getUserName = (user) => {
    return (
      user?.name ||
      user?.fullName ||
      user?.username ||
      "Guest User"
    );
  };


  const getUserPhone = (user) => {
    return (
      user?.phone ||
      user?.mobile ||
      user?.phoneNumber ||
      "—"
    );
  };


  const getUserEmail = (user) => {
    return (
      user?.email ||
      "—"
    );
  };


  const getUserDate = (user) => {
    const date =
      user?.createdAt ||
      user?.registeredAt;

    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  const getOrderCount = (user) => {
    return (
      user?.orderCount ??
      user?.ordersCount ??
      user?.totalOrders ??
      0
    );
  };


  const isUserActive = (user) => {
    return user?.isActive !== false;
  };


  const getInitials = (user) => {
    const name = getUserName(user);

    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length === 0) {
      return "U";
    }

    if (parts.length === 1) {
      return parts[0]
        .slice(0, 2)
        .toUpperCase();
    }

    return (
      parts[0][0] +
      parts[parts.length - 1][0]
    ).toUpperCase();
  };


  // ==========================================
  // FILTER USERS
  // ==========================================

  const filteredUsers = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    return users.filter((user) => {
      const name = getUserName(user)
        .toLowerCase();

      const phone = getUserPhone(user)
        .toLowerCase();

      const email = getUserEmail(user)
        .toLowerCase();

      const matchesSearch =
        !value ||
        name.includes(value) ||
        phone.includes(value) ||
        email.includes(value);

      const active =
        isUserActive(user);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && active) ||
        (statusFilter === "Blocked" && !active);

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    users,
    search,
    statusFilter,
  ]);


  // ==========================================
  // STATS
  // ==========================================

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => isUserActive(user)
  ).length;

  const blockedUsers =
    totalUsers - activeUsers;


  // ==========================================
  // VIEW USER
  // ==========================================

  const handleViewUser = async (user) => {
    try {
      setError("");

      setSelectedUser(user);
      setShowUserModal(true);

      const response =
        await getAdminUserById(user._id);

      if (response?.user) {
        setSelectedUser(response.user);
      }
    } catch (err) {
      console.error(
        "Get user details error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load user details."
      );
    }
  };


  // ==========================================
  // STATUS CONFIRMATION
  // ==========================================

  const openStatusConfirmation = (user) => {
    setStatusUser(user);
    setError("");
    setSuccess("");
  };


  const closeStatusConfirmation = () => {
    if (changingStatus) return;

    setStatusUser(null);
  };


  // ==========================================
  // CHANGE STATUS
  // ==========================================

  const confirmStatusChange = async () => {
    if (!statusUser) return;

    try {
      setChangingStatus(true);

      setError("");

      const newStatus =
        !isUserActive(statusUser);

      await updateAdminUserStatus(
        statusUser._id,
        newStatus
      );

      setUsers((previous) =>
        previous.map((user) =>
          user._id === statusUser._id
            ? {
                ...user,
                isActive: newStatus,
              }
            : user
        )
      );

      if (
        selectedUser?._id ===
        statusUser._id
      ) {
        setSelectedUser((previous) =>
          previous
            ? {
                ...previous,
                isActive: newStatus,
              }
            : previous
        );
      }

      setSuccess(
        newStatus
          ? "User activated successfully."
          : "User blocked successfully."
      );

      setStatusUser(null);

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error(
        "Change user status error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update user status."
      );
    } finally {
      setChangingStatus(false);
    }
  };


  return (
    <AdminLayout>
      <div className="min-h-full bg-[#faf7f2] p-4 md:p-6 lg:p-8">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-[#340C48] md:text-3xl">
                Users
              </h1>

              <span className="rounded-full bg-[#eadcf0] px-3 py-1 text-xs font-semibold text-[#340C48]">
                Customers
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Manage registered customers and their
              account status.
            </p>
          </div>


          <button
            type="button"
            onClick={() => loadUsers(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

        </div>


        {/* ======================================
            MESSAGES
        ====================================== */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}


        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}


        {/* ======================================
            STATS
        ====================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          {/* Total */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Total Users
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#340C48]">
                  {totalUsers}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0e4f3]">
                <UsersIcon
                  size={21}
                  className="text-[#340C48]"
                />
              </div>

            </div>
          </div>


          {/* Active */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Active Users
                </p>

                <p className="mt-2 text-3xl font-semibold text-green-700">
                  {activeUsers}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                <CheckCircle
                  size={21}
                  className="text-green-600"
                />
              </div>

            </div>
          </div>


          {/* Blocked */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Blocked Users
                </p>

                <p className="mt-2 text-3xl font-semibold text-red-600">
                  {blockedUsers}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                <Ban
                  size={21}
                  className="text-red-500"
                />
              </div>

            </div>
          </div>

        </div>


        {/* ======================================
            FILTER BAR
        ====================================== */}

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

          <div className="grid gap-3 md:grid-cols-[1fr_180px]">

            {/* Search */}

            <div className="relative">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search by name, phone or email..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#340C48] focus:bg-white"
              />

            </div>


            {/* Status */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#340C48]"
            >
              <option value="All">
                All Users
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Blocked">
                Blocked
              </option>
            </select>

          </div>

        </div>


        {/* ======================================
            USERS TABLE
        ====================================== */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            {loading ? (

              <div className="space-y-3 p-6">

                {[1, 2, 3, 4, 5].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex animate-pulse items-center gap-4"
                    >
                      <div className="h-11 w-11 rounded-full bg-gray-200" />

                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-40 rounded bg-gray-200" />
                        <div className="h-3 w-28 rounded bg-gray-200" />
                      </div>

                      <div className="h-8 w-20 rounded bg-gray-200" />
                    </div>
                  )
                )}

              </div>

            ) : filteredUsers.length === 0 ? (

              <div className="px-6 py-16 text-center">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f0e4f3]">
                  <UsersIcon
                    size={25}
                    className="text-[#340C48]"
                  />
                </div>

                <h2 className="text-xl font-semibold text-[#340C48]">
                  No users found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {search ||
                  statusFilter !== "All"
                    ? "Try changing your search or filters."
                    : "No customers have registered yet."}
                </p>

              </div>

            ) : (

              <table className="w-full min-w-[900px]">

                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">

                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      Contact
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      Orders
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      Joined
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>

                  </tr>
                </thead>


                <tbody>

                  {filteredUsers.map(
                    (user) => {
                      const active =
                        isUserActive(user);

                      return (
                        <tr
                          key={user._id}
                          className="border-b border-gray-100 last:border-b-0 hover:bg-[#fcfafc]"
                        >

                          {/* Customer */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eadcf0] text-sm font-semibold text-[#340C48]">
                                {getInitials(
                                  user
                                )}
                              </div>

                              <div>
                                <p className="font-semibold text-gray-800">
                                  {getUserName(
                                    user
                                  )}
                                </p>

                                <p className="mt-0.5 text-xs text-gray-400">
                                  ID:{" "}
                                  {user._id
                                    ?.slice(-8) ||
                                    "—"}
                                </p>
                              </div>

                            </div>

                          </td>


                          {/* Contact */}

                          <td className="px-5 py-4">

                            <div className="space-y-1">

                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone
                                  size={13}
                                  className="text-gray-400"
                                />

                                {getUserPhone(
                                  user
                                )}
                              </div>

                              {getUserEmail(
                                user
                              ) !== "—" && (
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                  <Mail
                                    size={13}
                                  />

                                  {getUserEmail(
                                    user
                                  )}
                                </div>
                              )}

                            </div>

                          </td>


                          {/* Orders */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">

                              <ShoppingBag
                                size={15}
                                className="text-[#8b5a9c]"
                              />

                              {getOrderCount(
                                user
                              )}

                            </div>

                          </td>


                          {/* Joined */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2 text-sm text-gray-600">

                              <CalendarDays
                                size={15}
                                className="text-gray-400"
                              />

                              {getUserDate(
                                user
                              )}

                            </div>

                          </td>


                          {/* Status */}

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  active
                                    ? "bg-green-600"
                                    : "bg-red-600"
                                }`}
                              />

                              {active
                                ? "Active"
                                : "Blocked"}
                            </span>

                          </td>


                          {/* Actions */}

                          <td className="px-5 py-4">

                            <div className="flex justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  handleViewUser(
                                    user
                                  )
                                }
                                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                              >
                                <Eye
                                  size={14}
                                />

                                View
                              </button>


                              <button
                                type="button"
                                onClick={() =>
                                  openStatusConfirmation(
                                    user
                                  )
                                }
                                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${
                                  active
                                    ? "border border-red-100 text-red-600 hover:bg-red-50"
                                    : "border border-green-100 text-green-600 hover:bg-green-50"
                                }`}
                              >
                                {active ? (
                                  <>
                                    <Ban
                                      size={
                                        14
                                      }
                                    />

                                    Block
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle
                                      size={
                                        14
                                      }
                                    />

                                    Activate
                                  </>
                                )}
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            )}

          </div>

        </div>


        {/* ======================================
            USER DETAILS MODAL
        ====================================== */}

        {showUserModal &&
          selectedUser && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

              <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

                {/* Header */}

                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

                  <div>
                    <h2 className="text-xl font-semibold text-[#340C48]">
                      User Details
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      Customer account information
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowUserModal(
                        false
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
                  >
                    <X size={18} />
                  </button>

                </div>


                {/* User */}

                <div className="p-5">

                  <div className="mb-6 flex items-center gap-4">

                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eadcf0] text-xl font-semibold text-[#340C48]">
                      {getInitials(
                        selectedUser
                      )}
                    </div>

                    <div>

                      <h3 className="text-lg font-semibold text-gray-800">
                        {getUserName(
                          selectedUser
                        )}
                      </h3>

                      <span
                        className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          isUserActive(
                            selectedUser
                          )
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isUserActive(
                          selectedUser
                        )
                          ? "Active"
                          : "Blocked"}
                      </span>

                    </div>

                  </div>


                  {/* Details */}

                  <div className="space-y-3">

                    <div className="rounded-xl bg-gray-50 p-4">

                      <div className="flex items-center gap-3">

                        <Phone
                          size={17}
                          className="text-[#8b5a9c]"
                        />

                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-400">
                            Phone
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-700">
                            {getUserPhone(
                              selectedUser
                            )}
                          </p>
                        </div>

                      </div>

                    </div>


                    <div className="rounded-xl bg-gray-50 p-4">

                      <div className="flex items-center gap-3">

                        <Mail
                          size={17}
                          className="text-[#8b5a9c]"
                        />

                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-400">
                            Email
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-700">
                            {getUserEmail(
                              selectedUser
                            )}
                          </p>
                        </div>

                      </div>

                    </div>


                    <div className="rounded-xl bg-gray-50 p-4">

                      <div className="flex items-center gap-3">

                        <CalendarDays
                          size={17}
                          className="text-[#8b5a9c]"
                        />

                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-400">
                            Joined
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-700">
                            {getUserDate(
                              selectedUser
                            )}
                          </p>
                        </div>

                      </div>

                    </div>


                    <div className="rounded-xl bg-gray-50 p-4">

                      <div className="flex items-center gap-3">

                        <ShoppingBag
                          size={17}
                          className="text-[#8b5a9c]"
                        />

                        <div>
                          <p className="text-[11px] uppercase tracking-wide text-gray-400">
                            Orders
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-700">
                            {getOrderCount(
                              selectedUser
                            )}
                          </p>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>


                {/* Footer */}

                <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4">

                  <button
                    type="button"
                    onClick={() =>
                      setShowUserModal(
                        false
                      )
                    }
                    className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowUserModal(
                        false
                      );

                      openStatusConfirmation(
                        selectedUser
                      );
                    }}
                    className={`rounded-xl px-5 py-2.5 text-sm font-semibold ${
                      isUserActive(
                        selectedUser
                      )
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {isUserActive(
                      selectedUser
                    )
                      ? "Block User"
                      : "Activate User"}
                  </button>

                </div>

              </div>

            </div>
          )}


        {/* ======================================
            STATUS CONFIRMATION
        ====================================== */}

        {statusUser && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">

            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

              <div className="mb-5 flex items-start gap-4">

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                    isUserActive(
                      statusUser
                    )
                      ? "bg-red-100"
                      : "bg-green-100"
                  }`}
                >
                  {isUserActive(
                    statusUser
                  ) ? (
                    <Ban
                      size={21}
                      className="text-red-600"
                    />
                  ) : (
                    <CheckCircle
                      size={21}
                      className="text-green-600"
                    />
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {isUserActive(
                      statusUser
                    )
                      ? "Block this user?"
                      : "Activate this user?"}
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-gray-500">
                    Are you sure you want to{" "}
                    {isUserActive(
                      statusUser
                    )
                      ? "block"
                      : "activate"}{" "}
                    <strong>
                      {getUserName(
                        statusUser
                      )}
                    </strong>
                    ?
                  </p>
                </div>

              </div>


              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={
                    closeStatusConfirmation
                  }
                  disabled={
                    changingStatus
                  }
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>


                <button
                  type="button"
                  onClick={
                    confirmStatusChange
                  }
                  disabled={
                    changingStatus
                  }
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60 ${
                    isUserActive(
                      statusUser
                    )
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {changingStatus
                    ? "Updating..."
                    : isUserActive(
                        statusUser
                      )
                    ? "Block User"
                    : "Activate User"}
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminUsers;