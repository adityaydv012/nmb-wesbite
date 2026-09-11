import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  ShoppingBag,
  Eye,
  X,
  User,
  Phone,
  CreditCard,
  CalendarDays,
  IndianRupee,
  Package,
} from "lucide-react";

import AdminLayout from "../components/admin/AdminLayout";
import adminApi from "../services/adminApi";

const statusOptions = [
  "All",
  "Placed",
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const editableStatusOptions = statusOptions.filter(
  (status) => status !== "All"
);

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState("");

  // Confirmation popup state
  const [showStatusConfirm, setShowStatusConfirm] =
    useState(false);

  const [pendingStatusChange, setPendingStatusChange] =
    useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminApi.get("/admin/orders");

      const ordersData =
        response.data?.orders ||
        response.data?.data ||
        response.data?.results ||
        [];

      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (err) {
      console.error("Orders loading error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getOrderId = (order) => {
    return (
      order.orderNumber ||
      order.orderId ||
      order._id ||
      "N/A"
    );
  };

  const getCustomerName = (order) => {
    return order.customerName || "Customer";
  };

  const getCustomerPhone = (order) => {
    return order.customerPhone || "Not available";
  };

  const getPaymentMode = (order) => {
    if (order.paymentMethod === "cod") {
      return "Cash on Delivery";
    }

    if (order.paymentMethod === "online") {
      return "Online Payment";
    }

    return order.paymentMethod || "Not available";
  };

  const getPaymentStatus = (order) => {
    return order.paymentStatus || "pending";
  };

  const getOrderStatus = (order) => {
    return order.orderStatus || "placed";
  };

  const getOrderAmount = (order) => {
    return order.totalAmount || 0;
  };

  const getOrderItems = (order) => {
    return Array.isArray(order.items) ? order.items : [];
  };

  const getOrderDate = (order) => {
    if (!order.createdAt) {
      return "Date unavailable";
    }

    const date = new Date(order.createdAt);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getOrderDateTime = (order) => {
    if (!order.createdAt) {
      return "Date unavailable";
    }

    const date = new Date(order.createdAt);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  };

  const normalizeStatus = (status) => {
    if (!status) {
      return "Placed";
    }

    return String(status)
      .replace(/[_-]/g, " ")
      .trim()
      .toLowerCase()
      .split(" ")
      .map((word) => {
        if (!word) return "";

        return (
          word.charAt(0).toUpperCase() +
          word.slice(1)
        );
      })
      .join(" ");
  };

  const getStatusClasses = (status) => {
    const normalizedStatus = String(
      status || ""
    ).toLowerCase();

    if (
      ["delivered", "completed"].includes(
        normalizedStatus
      )
    ) {
      return "bg-green-100 text-green-700";
    }

    if (
      ["cancelled", "canceled"].includes(
        normalizedStatus
      )
    ) {
      return "bg-red-100 text-red-700";
    }

    if (
      [
        "confirmed",
        "processing",
        "shipped",
      ].includes(normalizedStatus)
    ) {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-amber-100 text-amber-700";
  };

  // Opens confirmation popup instead of updating immediately
  const updateOrderStatus = (order, nextStatus) => {
    const orderId = order._id;

    if (!orderId || !nextStatus) {
      return;
    }

    const currentStatus = normalizeStatus(
      getOrderStatus(order)
    );

    // Don't show confirmation if status is unchanged
    if (currentStatus === nextStatus) {
      return;
    }

    setPendingStatusChange({
      order,
      nextStatus,
    });

    setShowStatusConfirm(true);
  };

  // Actual API update — called only after confirmation
  const confirmStatusChange = async () => {
    if (!pendingStatusChange) {
      return;
    }

    const { order, nextStatus } = pendingStatusChange;
    const orderId = order._id;

    try {
      setUpdatingOrderId(orderId);
      setError("");

      const response = await adminApi.patch(
        `/admin/orders/${orderId}/status`,
        {
          status: nextStatus.toLowerCase(),
        }
      );

      const updatedOrder =
        response.data?.order ||
        response.data?.data ||
        null;

      setOrders((previousOrders) =>
        previousOrders.map((item) => {
          if (item._id !== orderId) {
            return item;
          }

          return {
            ...item,
            ...(updatedOrder || {}),
            orderStatus:
              updatedOrder?.orderStatus ||
              nextStatus.toLowerCase(),
          };
        })
      );

      setSelectedOrder((previousOrder) => {
        if (
          !previousOrder ||
          previousOrder._id !== orderId
        ) {
          return previousOrder;
        }

        return {
          ...previousOrder,
          ...(updatedOrder || {}),
          orderStatus:
            updatedOrder?.orderStatus ||
            nextStatus.toLowerCase(),
        };
      });

      // Close confirmation after successful update
      setShowStatusConfirm(false);
      setPendingStatusChange(null);
    } catch (err) {
      console.error("Order status update error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingOrderId("");
    }
  };

  const cancelStatusChange = () => {
    setShowStatusConfirm(false);
    setPendingStatusChange(null);
  };

  const filteredOrders = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return orders.filter((order) => {
      const orderId = String(getOrderId(order))
        .toLowerCase();

      const customerName = String(
        getCustomerName(order)
      ).toLowerCase();

      const customerPhone = String(
        getCustomerPhone(order)
      ).toLowerCase();

      const paymentMode = String(
        getPaymentMode(order)
      ).toLowerCase();

      const matchesSearch =
        !search ||
        orderId.includes(search) ||
        customerName.includes(search) ||
        customerPhone.includes(search) ||
        paymentMode.includes(search);

      const matchesStatus =
        selectedStatus === "All" ||
        normalizeStatus(getOrderStatus(order)) ===
          selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  const activeOrdersCount = orders.filter((order) =>
    [
      "placed",
      "pending",
      "confirmed",
      "processing",
      "shipped",
    ].includes(
      String(getOrderStatus(order)).toLowerCase()
    )
  ).length;

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1500px] space-y-8">

        {/* HEADER */}

        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#8b788f]">
              Store Management
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#241a1c] md:text-4xl">
              Orders
            </h1>

            <p className="mt-2 text-sm text-[#81747b]">
              View customer details, payment information,
              and update order status.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            disabled={loading}
            className="flex w-fit items-center gap-2 rounded-xl bg-[#40134f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#531b67] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
            Refresh Orders
          </button>
        </section>

        {/* ERROR */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* STATS */}

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#eadfda] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#81747b]">
              Total Orders
            </p>

            <p className="mt-2 text-2xl font-bold text-[#241a1c]">
              {loading ? "—" : orders.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#eadfda] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#81747b]">
              Active Orders
            </p>

            <p className="mt-2 text-2xl font-bold text-amber-600">
              {loading ? "—" : activeOrdersCount}
            </p>
          </div>

          <div className="rounded-2xl border border-[#eadfda] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#81747b]">
              Showing Results
            </p>

            <p className="mt-2 text-2xl font-bold text-[#40134f]">
              {loading ? "—" : filteredOrders.length}
            </p>
          </div>
        </section>

        {/* ORDERS TABLE */}

        <section className="overflow-hidden rounded-2xl border border-[#eadfda] bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b border-[#eadfda] p-5 md:flex-row md:items-center md:justify-between">

            <div className="relative w-full md:max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1959b]"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search order, customer, phone..."
                className="w-full rounded-xl border border-[#eadfda] bg-[#fcfaf8] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#40134f] focus:ring-2 focus:ring-[#eadcf0]"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(event.target.value)
              }
              className="rounded-xl border border-[#eadfda] bg-[#fcfaf8] px-4 py-3 text-sm text-[#655961] outline-none focus:border-[#40134f] focus:ring-2 focus:ring-[#eadcf0]"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "All"
                    ? "All Statuses"
                    : status}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="px-6 py-14 text-center text-sm text-[#81747b]">
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <ShoppingBag
                size={38}
                className="mx-auto text-[#b8aeb2]"
              />

              <p className="mt-3 text-sm font-semibold text-[#655961]">
                No orders found
              </p>

              <p className="mt-1 text-xs text-[#a1959b]">
                Try changing your search or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1400px]">

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
                      Items
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Amount
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Payment Mode
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Payment Status
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Order Status
                    </th>

                    <th className="px-6 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order, index) => {
                    const orderItems = getOrderItems(order);

                    const orderStatus = normalizeStatus(
                      getOrderStatus(order)
                    );

                    const orderId = order._id;

                    return (
                      <tr
                        key={orderId || index}
                        className="border-b border-[#f0e9e5] last:border-0"
                      >

                        <td className="px-6 py-4 text-sm font-semibold text-[#40134f]">
                          #
                          {String(
                            getOrderId(order)
                          ).slice(-8)}
                        </td>

                        <td className="px-6 py-4">
                          <p className="whitespace-nowrap text-sm font-semibold text-[#241a1c]">
                            {getCustomerName(order)}
                          </p>

                          <p className="mt-1 whitespace-nowrap text-xs text-[#81747b]">
                            {getCustomerPhone(order)}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-sm text-[#81747b]">
                          {getOrderDate(order)}
                        </td>

                        <td className="px-6 py-4 text-sm text-[#655961]">
                          {orderItems.length}
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-[#241a1c]">
                          {formatCurrency(
                            getOrderAmount(order)
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span className="whitespace-nowrap text-sm font-medium text-[#655961]">
                            {getPaymentMode(order)}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusClasses(
                              getPaymentStatus(order)
                            )}`}
                          >
                            {getPaymentStatus(order)}
                          </span>
                        </td>

                        {/* STATUS DROPDOWN */}

                        <td className="px-6 py-4">
                          <select
                            value={orderStatus}
                            disabled={
                              updatingOrderId === orderId
                            }
                            onChange={(event) =>
                              updateOrderStatus(
                                order,
                                event.target.value
                              )
                            }
                            className={`rounded-lg border-0 px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#eadcf0] ${getStatusClasses(
                              orderStatus
                            )} disabled:cursor-not-allowed disabled:opacity-60`}
                          >
                            {editableStatusOptions.map(
                              (statusOption) => (
                                <option
                                  key={statusOption}
                                  value={statusOption}
                                >
                                  {statusOption}
                                </option>
                              )
                            )}
                          </select>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedOrder(order)
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-[#eadfda] px-3 py-2 text-xs font-semibold text-[#40134f] transition hover:bg-[#f7f4f1]"
                          >
                            <Eye size={15} />
                            View
                          </button>
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

      {/* ORDER DETAILS MODAL */}

      {selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-[#eadfda] px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#a1959b]">
                  Order Details
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#241a1c]">
                  #
                  {String(
                    getOrderId(selectedOrder)
                  ).slice(-8)}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-[#81747b] transition hover:bg-[#f7f4f1]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">

              {/* CUSTOMER / PAYMENT INFO */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-[#f7f4f1] p-4">
                  <div className="flex items-center gap-2 text-[#81747b]">
                    <User size={15} />
                    <p className="text-xs">
                      Customer Name
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-[#241a1c]">
                    {getCustomerName(selectedOrder)}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f7f4f1] p-4">
                  <div className="flex items-center gap-2 text-[#81747b]">
                    <Phone size={15} />
                    <p className="text-xs">
                      Phone Number
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-[#241a1c]">
                    {getCustomerPhone(selectedOrder)}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f7f4f1] p-4">
                  <div className="flex items-center gap-2 text-[#81747b]">
                    <CalendarDays size={15} />
                    <p className="text-xs">
                      Order Date
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-[#241a1c]">
                    {getOrderDateTime(selectedOrder)}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f7f4f1] p-4">
                  <div className="flex items-center gap-2 text-[#81747b]">
                    <IndianRupee size={15} />
                    <p className="text-xs">
                      Total Amount
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-[#241a1c]">
                    {formatCurrency(
                      getOrderAmount(selectedOrder)
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f7f4f1] p-4">
                  <div className="flex items-center gap-2 text-[#81747b]">
                    <CreditCard size={15} />
                    <p className="text-xs">
                      Payment Mode
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-[#241a1c]">
                    {getPaymentMode(selectedOrder)}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f7f4f1] p-4">
                  <div className="flex items-center gap-2 text-[#81747b]">
                    <CreditCard size={15} />
                    <p className="text-xs">
                      Payment Status
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-semibold capitalize text-[#241a1c]">
                    {getPaymentStatus(selectedOrder)}
                  </p>
                </div>

                {/* STATUS DROPDOWN IN MODAL */}

                <div className="rounded-xl bg-[#f7f4f1] p-4 sm:col-span-2">
                  <div className="flex items-center gap-2 text-[#81747b]">
                    <Package size={15} />
                    <p className="text-xs">
                      Order Status
                    </p>
                  </div>

                  <select
                    value={normalizeStatus(
                      getOrderStatus(selectedOrder)
                    )}
                    disabled={
                      updatingOrderId ===
                      selectedOrder._id
                    }
                    onChange={(event) =>
                      updateOrderStatus(
                        selectedOrder,
                        event.target.value
                      )
                    }
                    className={`mt-2 rounded-lg border-0 px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#eadcf0] ${getStatusClasses(
                      getOrderStatus(selectedOrder)
                    )}`}
                  >
                    {editableStatusOptions.map(
                      (statusOption) => (
                        <option
                          key={statusOption}
                          value={statusOption}
                        >
                          {statusOption}
                        </option>
                      )
                    )}
                  </select>
                </div>

              </div>

              {/* DELIVERY ADDRESS */}

              <div>
                <h3 className="mb-3 text-sm font-bold text-[#241a1c]">
                  Delivery Address
                </h3>

                <div className="rounded-xl bg-[#f7f4f1] p-4 text-sm leading-6 text-[#655961]">
                  <p>
                    {selectedOrder.deliveryAddress
                      ?.houseNo || ""}
                  </p>

                  <p>
                    {selectedOrder.deliveryAddress
                      ?.area || ""}
                  </p>

                  <p>
                    {selectedOrder.deliveryAddress
                      ?.city || ""}
                    ,{" "}
                    {selectedOrder.deliveryAddress
                      ?.state || ""}
                  </p>

                  <p>
                    PIN Code:{" "}
                    {selectedOrder.deliveryAddress
                      ?.pinCode || "Not available"}
                  </p>
                </div>
              </div>

              {/* ORDER ITEMS */}

              <div>
                <h3 className="mb-3 text-sm font-bold text-[#241a1c]">
                  Order Items
                </h3>

                {getOrderItems(selectedOrder).length ===
                0 ? (
                  <p className="rounded-xl bg-[#f7f4f1] p-4 text-sm text-[#81747b]">
                    No item details available.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {getOrderItems(selectedOrder).map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-4 rounded-xl border border-[#eadfda] p-4"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[#241a1c]">
                              {item.name ||
                                `Item ${index + 1}`}
                            </p>

                            <p className="mt-1 text-xs text-[#81747b]">
                              Quantity:{" "}
                              {item.quantity || 1}
                            </p>

                            {item.weight && (
                              <p className="mt-1 text-xs text-[#81747b]">
                                Weight: {item.weight}
                              </p>
                            )}
                          </div>

                          <p className="whitespace-nowrap text-sm font-semibold text-[#40134f]">
                            {formatCurrency(
                              item.itemTotal ??
                                item.price *
                                  (item.quantity || 1)
                            )}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* STATUS CONFIRMATION MODAL */}

      {showStatusConfirm && pendingStatusChange && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            {/* TITLE */}

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f7f4f1]">
                <Package
                  size={24}
                  className="text-[#40134f]"
                />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#241a1c]">
                  Change Order Status?
                </h2>

                <p className="mt-1 text-sm text-[#81747b]">
                  Are you sure you want to change the
                  status of this order?
                </p>
              </div>
            </div>

            {/* ORDER INFO */}

            <div className="mt-5 rounded-xl bg-[#fcfaf8] p-4">

              <p className="text-xs font-semibold uppercase tracking-wide text-[#a1959b]">
                Order
              </p>

              <p className="mt-1 text-sm font-bold text-[#40134f]">
                #
                {String(
                  getOrderId(pendingStatusChange.order)
                ).slice(-8)}
              </p>

              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-[#81747b]">
                  Current Status
                </span>

                <span className="font-semibold text-[#655961]">
                  {normalizeStatus(
                    getOrderStatus(
                      pendingStatusChange.order
                    )
                  )}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                <span className="text-[#81747b]">
                  New Status
                </span>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                    pendingStatusChange.nextStatus
                  )}`}
                >
                  {pendingStatusChange.nextStatus}
                </span>
              </div>

            </div>

            {/* ACTIONS */}

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={cancelStatusChange}
                disabled={updatingOrderId !== ""}
                className="rounded-xl border border-[#eadfda] px-4 py-2.5 text-sm font-semibold text-[#655961] transition hover:bg-[#f7f4f1] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmStatusChange}
                disabled={updatingOrderId !== ""}
                className="rounded-xl bg-[#40134f] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#531b67] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updatingOrderId !== ""
                  ? "Updating..."
                  : "Confirm Change"}
              </button>

            </div>

          </div>

        </div>
      )}

    </AdminLayout>
  );
};

export default AdminOrders;