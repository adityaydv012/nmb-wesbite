import { useEffect, useMemo, useState } from "react";
import {
  IndianRupee,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  PackageCheck,
} from "lucide-react";

import AdminLayout from "../components/admin/AdminLayout";
import adminApi from "../services/adminApi";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [ordersResponse, usersResponse] = await Promise.all([
        adminApi.get("/admin/orders"),
        adminApi.get("/admin/users"),
      ]);

      const ordersData =
        ordersResponse.data?.orders ||
        ordersResponse.data?.data ||
        [];

      const usersData =
        usersResponse.data?.users ||
        usersResponse.data?.data ||
        [];

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const dashboardStats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => {
      const amount =
        order.totalAmount ??
        order.totalPrice ??
        order.grandTotal ??
        order.amount ??
        0;

      return sum + Number(amount || 0);
    }, 0);

    const pendingOrders = orders.filter((order) => {
      const status = String(order.status || "").toLowerCase();

      return [
        "pending",
        "processing",
        "confirmed",
        "placed",
      ].includes(status);
    }).length;

    const completedOrders = orders.filter((order) => {
      const status = String(order.status || "").toLowerCase();

      return [
        "completed",
        "delivered",
        "success",
      ].includes(status);
    }).length;

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalUsers: users.length,
      pendingOrders,
      completedOrders,
    };
  }, [orders, users]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date unavailable";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getOrderId = (order) => {
    return (
      order.orderNumber ||
      order.orderId ||
      order._id ||
      "N/A"
    );
  };

  const getCustomerName = (order) => {
    return (
      order.user?.fullName ||
      order.user?.name ||
      order.customer?.fullName ||
      order.customer?.name ||
      order.fullName ||
      order.name ||
      order.user?.phone ||
      "Customer"
    );
  };

  const getOrderAmount = (order) => {
    return (
      order.totalAmount ??
      order.totalPrice ??
      order.grandTotal ??
      order.amount ??
      0
    );
  };

  const getStatusClasses = (status) => {
    const normalizedStatus = String(status || "").toLowerCase();

    if (
      ["completed", "delivered", "success"].includes(
        normalizedStatus
      )
    ) {
      return "bg-green-100 text-green-700";
    }

    if (
      ["cancelled", "canceled", "failed"].includes(
        normalizedStatus
      )
    ) {
      return "bg-red-100 text-red-700";
    }

    if (
      ["processing", "confirmed", "placed"].includes(
        normalizedStatus
      )
    ) {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-amber-100 text-amber-700";
  };

  const stats = [
    {
      label: "Total Revenue",
      value: formatCurrency(dashboardStats.totalRevenue),
      icon: IndianRupee,
      iconBackground: "bg-green-100",
      iconColor: "text-green-700",
      description: "From all orders",
    },
    {
      label: "Total Orders",
      value: dashboardStats.totalOrders,
      icon: ShoppingBag,
      iconBackground: "bg-purple-100",
      iconColor: "text-purple-700",
      description: "All customer orders",
    },
    {
      label: "Total Users",
      value: dashboardStats.totalUsers,
      icon: Users,
      iconBackground: "bg-blue-100",
      iconColor: "text-blue-700",
      description: "Registered customers",
    },
    {
      label: "Pending Orders",
      value: dashboardStats.pendingOrders,
      icon: Clock3,
      iconBackground: "bg-amber-100",
      iconColor: "text-amber-700",
      description: "Needs attention",
    },
  ];

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#8b788f]">
              Overview
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#241a1c] md:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-[#81747b]">
              Monitor your store performance and recent activity.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboardData}
            className="flex w-fit items-center gap-2 rounded-xl bg-[#40134f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#531b67]"
          >
            <TrendingUp size={18} />
            Refresh Data
          </button>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#eadfda] bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#81747b]">
                      {stat.label}
                    </p>

                    <h3 className="mt-3 text-2xl font-bold text-[#241a1c]">
                      {loading ? "—" : stat.value}
                    </h3>
                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBackground} ${stat.iconColor}`}
                  >
                    <Icon size={21} />
                  </div>
                </div>

                <p className="mt-4 text-xs text-[#a1959b]">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-[#eadfda] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <CheckCircle2 size={20} />
              </div>

              <div>
                <p className="text-sm text-[#81747b]">
                  Completed Orders
                </p>
                <p className="text-xl font-bold text-[#241a1c]">
                  {loading ? "—" : dashboardStats.completedOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#eadfda] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <PackageCheck size={20} />
              </div>

              <div>
                <p className="text-sm text-[#81747b]">
                  Active Orders
                </p>
                <p className="text-xl font-bold text-[#241a1c]">
                  {loading ? "—" : dashboardStats.pendingOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#eadfda] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <ArrowUpRight size={20} />
              </div>

              <div>
                <p className="text-sm text-[#81747b]">
                  Store Status
                </p>
                <p className="text-xl font-bold text-green-600">
                  Live
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#eadfda] bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-[#eadfda] px-5 py-5 sm:flex-row sm:items-center md:px-6">
            <div>
              <h2 className="text-lg font-bold text-[#241a1c]">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-[#81747b]">
                Latest orders received from customers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.location.assign("/admin/orders")}
              className="text-sm font-semibold text-[#40134f] hover:underline"
            >
              View all orders
            </button>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-[#81747b]">
              Loading recent orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <ShoppingBag
                size={34}
                className="mx-auto text-[#b8aeb2]"
              />

              <p className="mt-3 text-sm font-semibold text-[#655961]">
                No orders found
              </p>

              <p className="mt-1 text-xs text-[#a1959b]">
                New customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="border-b border-[#eadfda] bg-[#fcfaf8] text-left text-xs uppercase tracking-wide text-[#a1959b]">
                    <th className="px-6 py-4 font-semibold">
                      Order
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Customer
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Date
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Amount
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.slice(0, 6).map((order, index) => {
                    const status = order.status || "Pending";

                    return (
                      <tr
                        key={order._id || order.orderId || index}
                        className="border-b border-[#f0e9e5] last:border-0"
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-[#40134f]">
                          #{String(getOrderId(order)).slice(-8)}
                        </td>

                        <td className="px-6 py-4 text-sm text-[#655961]">
                          {getCustomerName(order)}
                        </td>

                        <td className="px-6 py-4 text-sm text-[#81747b]">
                          {formatDate(
                            order.createdAt || order.createdDate
                          )}
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-[#241a1c]">
                          {formatCurrency(getOrderAmount(order))}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;