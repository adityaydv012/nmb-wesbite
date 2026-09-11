import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import AllSweets from "./pages/AllSweets";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ContactUs from "./pages/ContactUs";
import OrderDetails from "./pages/OrderDetails";
import Orders from "./pages/Orders";
import OurOutlets from "./pages/OurOutlets";
import OurStory from "./pages/OurStory";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <Routes>
      {/* =====================================================
          HOME
      ====================================================== */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* =====================================================
          ALL SWEETS
      ====================================================== */}
      <Route
        path="/all-sweets"
        element={<AllSweets />}
      />

      {/* Old sweets URL */}
      <Route
        path="/sweets"
        element={
          <Navigate
            to="/all-sweets"
            replace
          />
        }
      />

      {/* =====================================================
          CART
      ====================================================== */}
      <Route
        path="/cart"
        element={<Cart />}
      />

      {/* =====================================================
          CHECKOUT
      ====================================================== */}
      <Route
        path="/checkout"
        element={<Checkout />}
      />

      {/* =====================================================
          ORDERS
      ====================================================== */}
      <Route
        path="/orders"
        element={<Orders />}
      />

      <Route
        path="/orders/:orderId"
        element={<OrderDetails />}
      />

      {/* =====================================================
          PROFILE
      ====================================================== */}
      <Route
        path="/profile"
        element={<Profile />}
      />

      {/* =====================================================
          OUR STORY
      ====================================================== */}
      <Route
        path="/our-story"
        element={<OurStory />}
      />

      {/* =====================================================
          OUR OUTLETS
      ====================================================== */}
      <Route
        path="/our-outlets"
        element={<OurOutlets />}
      />

      {/* =====================================================
          CONTACT US
      ====================================================== */}
      <Route
        path="/contact-us"
        element={<ContactUs />}
      />

      {/* =====================================================
          FALLBACK
      ====================================================== */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
};

export default App;