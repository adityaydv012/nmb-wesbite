const WEB3FORMS_URL = "https://api.web3forms.com/submit";

export const sendOrderCompletedMail = async (order) => {
  try {
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      console.error(
        "WEB3FORMS_ACCESS_KEY is missing from environment variables."
      );
      return false;
    }

    const orderId =
      order.orderNumber ||
      order.orderId ||
      order._id?.toString() ||
      "N/A";

    const customerName =
      order.customerName ||
      order.userDetails?.name ||
      order.user?.name ||
      "Customer";

    const customerEmail =
      order.customerEmail ||
      order.userDetails?.email ||
      order.user?.email ||
      "Not available";

    const customerPhone =
      order.customerPhone ||
      order.userDetails?.phone ||
      order.user?.phone ||
      "Not available";

    const totalAmount =
      order.totalAmount ??
      order.total ??
      order.grandTotal ??
      0;

    const paymentStatus =
      order.paymentStatus || "Not available";

    const paymentMethod =
      order.paymentMethod || "Not available";

    const items = Array.isArray(order.items)
      ? order.items
      : [];

    const itemDetails =
      items.length > 0
        ? items
            .map((item, index) => {
              const name =
                item.name ||
                item.productName ||
                item.product?.name ||
                `Item ${index + 1}`;

              const quantity = item.quantity || 1;

              const price =
                item.price ??
                item.itemTotal ??
                0;

              return `${index + 1}. ${name} | Qty: ${quantity} | ₹${Number(
                price
              ).toLocaleString("en-IN")}`;
            })
            .join("\n")
        : "No item details available.";

    const message = `
A customer order has been completed.

ORDER DETAILS
------------------------------
Order ID: ${orderId}
Order Status: ${order.orderStatus || "Completed"}

CUSTOMER DETAILS
------------------------------
Name: ${customerName}
Email: ${customerEmail}
Phone: ${customerPhone}

PAYMENT DETAILS
------------------------------
Payment Method: ${paymentMethod}
Payment Status: ${paymentStatus}
Total Amount: ₹${Number(totalAmount).toLocaleString("en-IN")}

ORDER ITEMS
------------------------------
${itemDetails}

This is an automatic notification from the Narayan Misthan Bhandar order system.
`;

    const formData = new FormData();

    formData.append("access_key", accessKey);
    formData.append(
      "subject",
      `Order Completed - #${orderId}`
    );
    formData.append(
      "from_name",
      "Narayan Misthan Bhandar Orders"
    );
    formData.append(
      "email",
      customerEmail !== "Not available"
        ? customerEmail
        : "no-reply@nmbsweets.com"
    );
    formData.append("message", message);
    formData.append("botcheck", "");

    const response = await fetch(WEB3FORMS_URL, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error(
        "Web3Forms order completion email failed:",
        result
      );

      return false;
    }

    console.log(
      `Order completion email sent successfully for order ${orderId}`
    );

    return true;
  } catch (error) {
    console.error(
      "Send order completed email error:",
      error
    );

    return false;
  }
};