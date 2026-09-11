// src/pages/OrderDetails.jsx

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Package,
  RefreshCw,
  Truck,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { getOrderById } from "../services/api";

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
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function getOrderStatus(order) {
  return (
    order.status ||
    order.orderStatus ||
    order.paymentStatus ||
    "Processing"
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

function getItemName(item) {
  return (
    item.productName ||
    item.name ||
    item.title ||
    item.product?.name ||
    item.product?.title ||
    "Sweet item"
  );
}

function getItemQuantity(item) {
  return item.quantity || item.qty || 1;
}

function getItemPrice(item) {
  return (
    item.price ??
    item.amount ??
    item.product?.price ??
    0
  );
}

function getItemImage(item) {
  return (
    item.image ||
    item.imageUrl ||
    item.productImage ||
    item.product?.image ||
    item.product?.imageUrl ||
    null
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

function getSubtotal(order) {
  return (
    order.subtotal ??
    order.subTotal ??
    getOrderTotal(order)
  );
}

function getDeliveryCharge(order) {
  return (
    order.deliveryCharge ??
    order.shippingCharge ??
    order.deliveryFee ??
    0
  );
}

function getAddress(order) {
  return (
    order.deliveryAddress ||
    order.shippingAddress ||
    order.address ||
    null
  );
}

export default function OrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrder() {
    try {
      setLoading(true);
      setError("");

      const response = await getOrderById(orderId);

      const receivedOrder =
        response.order ||
        response.data?.order ||
        response.data ||
        response;

      setOrder(receivedOrder);
    } catch (err) {
      setError(err.message || "Unable to load this order.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const items = order ? getOrderItems(order) : [];
  const address = order ? getAddress(order) : null;

  return (
    <div className="min-h-screen bg-[#FFF9F2]">
      <Navbar />

      <main className="px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1180px]">
          <Link
            to="/orders"
            className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-[#756B78] transition hover:text-[#340C48]"
          >
            <ArrowLeft size={15} />
            Back to Orders
          </Link>

          {loading && (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-[#E9DFD1] bg-white">
              <RefreshCw
                size={28}
                className="animate-spin text-[#C9A45C]"
              />

              <p className="mt-4 text-sm text-[#756B78]">
                Loading order details...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
              <p className="text-sm text-red-700">{error}</p>

              <button
                type="button"
                onClick={loadOrder}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#340C48] px-5 py-3 text-xs font-semibold text-white"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && !order && (
            <div className="rounded-2xl border border-[#E9DFD1] bg-white px-6 py-12 text-center">
              <Package
                size={35}
                className="mx-auto text-[#C9A45C]"
              />

              <h1 className="mt-5 font-[var(--font-display)] text-2xl text-[#340C48]">
                Order not found
              </h1>

              <Link
                to="/orders"
                className="mt-6 inline-flex rounded-full bg-[#340C48] px-6 py-3 text-xs font-semibold text-white"
              >
                View My Orders
              </Link>
            </div>
          )}

          {!loading && !error && order && (
            <>
              <div className="mb-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A45C]">
                  Order Details
                </p>

                <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <h1 className="font-[var(--font-display)] text-4xl text-[#340C48] sm:text-5xl">
                      Order #{order._id || order.id || orderId}
                    </h1>

                    <p className="mt-3 text-sm text-[#756B78]">
                      Placed on{" "}
                      {formatDate(
                        order.createdAt ||
                          order.orderDate ||
                          order.date
                      )}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold capitalize text-amber-700">
                    {getOrderStatus(order)}
                  </span>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <div className="space-y-6">
                  <section className="rounded-2xl border border-[#E9DFD1] bg-white p-5 sm:p-7">
                    <div className="flex items-center gap-3">
                      <Package size={20} className="text-[#C9A45C]" />

                      <h2 className="font-[var(--font-display)] text-2xl text-[#340C48]">
                        Ordered Items
                      </h2>
                    </div>

                    <div className="mt-6 divide-y divide-[#EEE5DA]">
                      {items.length === 0 && (
                        <p className="py-6 text-sm text-[#756B78]">
                          No item details available for this order.
                        </p>
                      )}

                      {items.map((item, index) => {
                        const image = getItemImage(item);
                        const name = getItemName(item);
                        const quantity = getItemQuantity(item);
                        const price = getItemPrice(item);

                        return (
                          <div
                            key={item._id || item.id || index}
                            className="flex gap-4 py-5 first:pt-0 last:pb-0"
                          >
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F6EEE3]">
                              {image ? (
                                <img
                                  src={image}
                                  alt={name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Package
                                  size={25}
                                  className="text-[#C9A45C]"
                                />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-semibold text-[#340C48]">
                                {name}
                              </h3>

                              <p className="mt-2 text-xs text-[#756B78]">
                                Quantity: {quantity}
                              </p>
                            </div>

                            <p className="text-sm font-semibold text-[#340C48]">
                              {formatCurrency(price * quantity)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  <section className="rounded-2xl border border-[#E9DFD1] bg-white p-5 sm:p-7">
                    <div className="flex items-center gap-3">
                      <Truck size={20} className="text-[#C9A45C]" />

                      <h2 className="font-[var(--font-display)] text-2xl text-[#340C48]">
                        Delivery Information
                      </h2>
                    </div>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-[#9B8C9C]">
                          Delivery status
                        </p>

                        <p className="mt-2 text-sm font-medium capitalize text-[#340C48]">
                          {getOrderStatus(order)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-[#9B8C9C]">
                          Payment status
                        </p>

                        <p className="mt-2 text-sm font-medium capitalize text-[#340C48]">
                          {order.paymentStatus || "Not available"}
                        </p>
                      </div>
                    </div>

                    {address && (
                      <div className="mt-6 border-t border-[#EEE5DA] pt-6">
                        <p className="text-xs text-[#9B8C9C]">
                          Delivery address
                        </p>

                        <p className="mt-2 text-sm leading-6 text-[#340C48]">
                          {typeof address === "string"
                            ? address
                            : [
                                address.houseNo,
                                address.area,
                                address.city,
                                address.state,
                                address.pinCode ||
                                  address.pincode ||
                                  address.zipCode,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                        </p>
                      </div>
                    )}
                  </section>
                </div>

                <aside className="h-fit rounded-2xl border border-[#E9DFD1] bg-white p-5 sm:p-7">
                  <h2 className="font-[var(--font-display)] text-2xl text-[#340C48]">
                    Order Summary
                  </h2>

                  <div className="mt-6 space-y-4 border-b border-[#EEE5DA] pb-6">
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-[#756B78]">
                        Subtotal
                      </span>

                      <span className="font-medium text-[#340C48]">
                        {formatCurrency(getSubtotal(order))}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-[#756B78]">
                        Delivery
                      </span>

                      <span className="font-medium text-[#340C48]">
                        {getDeliveryCharge(order) === 0
                          ? "Free"
                          : formatCurrency(
                              getDeliveryCharge(order)
                            )}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-[#340C48]">
                      Total
                    </span>

                    <span className="text-xl font-semibold text-[#340C48]">
                      {formatCurrency(getOrderTotal(order))}
                    </span>
                  </div>

                  <div className="mt-7 flex items-center gap-2 rounded-xl bg-[#F6EEE3] px-4 py-3 text-xs text-[#756B78]">
                    <CheckCircle2
                      size={16}
                      className="shrink-0 text-[#C9A45C]"
                    />
                    Your order information is fetched from your
                    account.
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}