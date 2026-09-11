// src/pages/Orders.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Package,
  RefreshCw,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { getOrders } from "../services/api";

function formatDate(dateValue) {
  if (!dateValue) return "Date unavailable";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value) {
  const amount = Number(value || 0);

  return `₹${amount.toLocaleString("en-IN")}`;
}

function getOrderId(order) {
  return order._id || order.id || order.orderId;
}

function getOrderStatus(order) {
  return (
    order.status ||
    order.orderStatus ||
    order.paymentStatus ||
    "Processing"
  );
}

function getOrderTotal(order) {
  return (
    order.totalAmount ??
    order.total ??
    order.grandTotal ??
    order.amount ??
    0
  );
}

function getOrderItems(order) {
  return (
    order.items ||
    order.products ||
    order.orderItems ||
    []
  );
}

function getOrderDate(order) {
  return (
    order.createdAt ||
    order.orderDate ||
    order.date ||
    order.updatedAt
  );
}

function getStatusClasses(status) {
  const normalizedStatus = String(status).toLowerCase();

  if (
    normalizedStatus.includes("deliver") ||
    normalizedStatus.includes("complete")
  ) {
    return "bg-green-100 text-green-700";
  }

  if (
    normalizedStatus.includes("cancel") ||
    normalizedStatus.includes("fail")
  ) {
    return "bg-red-100 text-red-700";
  }

  if (
    normalizedStatus.includes("ship") ||
    normalizedStatus.includes("dispatch")
  ) {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-amber-100 text-amber-700";
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await getOrders();

      const receivedOrders = Array.isArray(response)
        ? response
        : response.orders ||
          response.data?.orders ||
          response.data ||
          [];

      setOrders(
        Array.isArray(receivedOrders) ? receivedOrders : []
      );
    } catch (err) {
      setError(err.message || "Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF9F2]">
      <Navbar />

      <main className="px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A45C]">
              My Account
            </p>

            <h1 className="mt-3 font-[var(--font-display)] text-4xl text-[#340C48] sm:text-5xl">
              My Orders
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#756B78]">
              View your previous purchases and track your sweet
              deliveries.
            </p>
          </div>

          {loading && (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-[#E9DFD1] bg-white px-6 text-center">
              <RefreshCw
                size={28}
                className="animate-spin text-[#C9A45C]"
              />

              <p className="mt-4 text-sm text-[#756B78]">
                Loading your orders...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
              <p className="text-sm text-red-700">{error}</p>

              <button
                type="button"
                onClick={loadOrders}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#340C48] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#4B1D63]"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#DCCDBB] bg-white px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F6EEE3]">
                <Package size={28} className="text-[#C9A45C]" />
              </div>

              <h2 className="mt-6 font-[var(--font-display)] text-2xl text-[#340C48]">
                No orders yet
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-[#756B78]">
                You have not placed any orders yet. Explore our
                sweets and place your first order.
              </p>

              <Link
                to="/sweets"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#340C48] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#4B1D63]"
              >
                Explore Sweets
                <ArrowRight size={15} />
              </Link>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="space-y-5">
              {orders.map((order) => {
                const orderId = getOrderId(order);
                const status = getOrderStatus(order);
                const items = getOrderItems(order);

                return (
                  <div
                    key={orderId}
                    className="rounded-2xl border border-[#E9DFD1] bg-white p-5 sm:p-7"
                  >
                    <div className="flex flex-col justify-between gap-5 border-b border-[#EEE5DA] pb-5 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9B8C9C]">
                          Order ID
                        </p>

                        <p className="mt-2 text-sm font-semibold text-[#340C48]">
                          #{orderId}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1.5 text-[11px] font-semibold capitalize ${getStatusClasses(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="grid gap-5 py-6 sm:grid-cols-3">
                      <div className="flex items-start gap-3">
                        <CalendarDays
                          size={18}
                          className="mt-0.5 text-[#C9A45C]"
                        />

                        <div>
                          <p className="text-xs text-[#9B8C9C]">
                            Order date
                          </p>

                          <p className="mt-1 text-sm font-medium text-[#340C48]">
                            {formatDate(getOrderDate(order))}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Package
                          size={18}
                          className="mt-0.5 text-[#C9A45C]"
                        />

                        <div>
                          <p className="text-xs text-[#9B8C9C]">
                            Items
                          </p>

                          <p className="mt-1 text-sm font-medium text-[#340C48]">
                            {items.length}{" "}
                            {items.length === 1 ? "item" : "items"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-[#9B8C9C]">
                          Total amount
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#340C48]">
                          {formatCurrency(getOrderTotal(order))}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end border-t border-[#EEE5DA] pt-5">
                      <Link
                        to={`/orders/${orderId}`}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-[#340C48] transition hover:text-[#C9A45C]"
                      >
                        View Order Details
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}