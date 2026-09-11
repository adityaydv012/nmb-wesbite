import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import adminApi from "../services/adminApi";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const existingToken = localStorage.getItem("adminToken");

  if (existingToken) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await adminApi.post("/admin/auth/login", {
        email: email.trim(),
        password,
      });

      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);

        localStorage.setItem(
          "adminUser",
          JSON.stringify(response.data.admin)
        );

        navigate("/admin/dashboard", { replace: true });
      } else {
        setError(response.data.message || "Unable to login.");
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to connect to the backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f4f1] px-4 py-10">
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#340c48] text-white shadow-lg">
              <ShieldCheck size={32} strokeWidth={1.8} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#241a1c]">
              NMB Admin
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage Narayan Misthan Bhandar
            </p>
          </div>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome back
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Sign in to access your admin panel.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@nmb.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#340c48] focus:bg-white focus:ring-4 focus:ring-[#340c48]/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-12 text-sm outline-none transition focus:border-[#340c48] focus:bg-white focus:ring-4 focus:ring-[#340c48]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((currentValue) => !currentValue)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-[#340c48] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4a1762] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in to Admin Panel"}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
              <LockKeyhole size={13} />
              <span>Authorized admin access only</span>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AdminLogin;