import { Navigate, Route, Routes } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import AdminUsers from "./pages/AdminUsers";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return children;
};

const App = () => {
  return (
    <Routes>

      {/* ========================================
          ROOT
      ======================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/admin/login"
            replace
          />
        }
      />


      {/* ========================================
          ADMIN LOGIN
      ======================================== */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />


      {/* ========================================
          ADMIN DASHBOARD
      ======================================== */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />


      {/* ========================================
          ADMIN ORDERS
      ======================================== */}

      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute>
            <AdminOrders />
          </ProtectedRoute>
        }
      />


      {/* ========================================
          ADMIN PRODUCTS
      ======================================== */}

      <Route
        path="/admin/products"
        element={
          <ProtectedRoute>
            <AdminProducts />
          </ProtectedRoute>
        }
      />


      {/* ========================================
          ADMIN CATEGORIES / SHOWCASE SWEETS
      ======================================== */}

      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute>
            <AdminCategories />
          </ProtectedRoute>
        }
      />


      {/* ========================================
          ADMIN USERS
      ======================================== */}

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminUsers />
          </ProtectedRoute>
        }
      />


      {/* ========================================
          FALLBACK
      ======================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/admin/login"
            replace
          />
        }
      />

    </Routes>
  );
};

export default App;