import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Check,
  ChevronRight,
  ClipboardList,
  Edit3,
  Loader2,
  LogOut,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import {
  addAddress,
  deleteAddress,
  getAddresses,
  getProfile,
  setDefaultAddress,
  updateAddress,
  updateProfile,
} from "../services/api";

const EMPTY_ADDRESS = {
  fullName: "",
  phone: "",
  houseNo: "",
  area: "",
  landmark: "",
  city: "",
  state: "",
  pinCode: "",
  addressType: "Home",
};

export default function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
  });

  const [addressForm, setAddressForm] = useState({
    ...EMPTY_ADDRESS,
  });

  const [editingAddressId, setEditingAddressId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("nmb_token");

    if (!token) {
      navigate("/");
      return;
    }

    loadProfileData();
  }, [navigate]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError("");

      const [profileResponse, addressResponse] =
        await Promise.all([
          getProfile(),
          getAddresses(),
        ]);

      const user =
        profileResponse?.user ||
        profileResponse?.profile ||
        profileResponse ||
        null;

      const savedAddresses =
        addressResponse?.addresses ||
        addressResponse?.data ||
        [];

      setProfile(user);

      setAddresses(
        Array.isArray(savedAddresses)
          ? savedAddresses
          : []
      );

      setProfileForm({
        fullName:
          user?.fullName ||
          user?.name ||
          "",
        email: user?.email || "",
      });
    } catch (requestError) {
      console.error(
        "Failed to load profile:",
        requestError
      );

      setError(
        requestError.message ||
          "Unable to load your account details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("nmb_token");
    localStorage.removeItem("nmb_user");

    navigate("/");
    window.location.reload();
  };

  const handleProfileInput = (event) => {
    const { name, value } = event.target;

    setProfileForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const openProfileModal = () => {
    setError("");
    setSuccess("");

    setProfileForm({
      fullName:
        profile?.fullName ||
        profile?.name ||
        "",
      email: profile?.email || "",
    });

    setProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    if (savingProfile) return;

    setProfileModalOpen(false);
    setError("");
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = profileForm.fullName.trim();
    const trimmedEmail = profileForm.email.trim();

    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }

    try {
      setSavingProfile(true);
      setError("");
      setSuccess("");

      const response = await updateProfile({
        fullName: trimmedName,
        email: trimmedEmail,
      });

      const updatedUser =
        response?.user ||
        response?.profile ||
        response ||
        {};

      const mergedProfile = {
        ...profile,
        ...updatedUser,
        fullName:
          updatedUser.fullName ||
          trimmedName,
        email:
          updatedUser.email ??
          trimmedEmail,
      };

      setProfile(mergedProfile);

      localStorage.setItem(
        "nmb_user",
        JSON.stringify(mergedProfile)
      );

      setProfileModalOpen(false);
      setSuccess("Profile updated successfully.");
    } catch (requestError) {
      console.error(
        "Failed to update profile:",
        requestError
      );

      setError(
        requestError.message ||
          "Unable to update your profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const openAddAddressModal = () => {
    setEditingAddressId(null);

    setAddressForm({
      ...EMPTY_ADDRESS,
    });

    setError("");
    setSuccess("");
    setAddressModalOpen(true);
  };

  const openEditAddressModal = (address) => {
    setEditingAddressId(
      address?._id || address?.id || null
    );

    setAddressForm({
      fullName:
        address?.fullName ||
        address?.name ||
        "",
      phone:
        address?.phone ||
        address?.mobileNumber ||
        address?.number ||
        "",
      houseNo: address?.houseNo || "",
      area: address?.area || "",
      landmark: address?.landmark || "",
      city: address?.city || "",
      state: address?.state || "",
      pinCode:
        address?.pinCode ||
        address?.pincode ||
        address?.postalCode ||
        "",
      addressType:
        address?.addressType ||
        "Home",
    });

    setError("");
    setSuccess("");
    setAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    if (savingAddress) return;

    setAddressModalOpen(false);
    setEditingAddressId(null);

    setAddressForm({
      ...EMPTY_ADDRESS,
    });

    setError("");
  };

  const handleAddressInput = (event) => {
    const { name, value } = event.target;

    let nextValue = value;

    if (name === "phone") {
      nextValue = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }

    if (name === "pinCode") {
      nextValue = value
        .replace(/\D/g, "")
        .slice(0, 6);
    }

    setAddressForm((currentForm) => ({
      ...currentForm,
      [name]: nextValue,
    }));
  };

  const handleAddressSubmit = async (event) => {
    event.preventDefault();

    const cleanedAddress = {
      fullName: addressForm.fullName.trim(),
      phone: addressForm.phone.trim(),
      houseNo: addressForm.houseNo.trim(),
      area: addressForm.area.trim(),
      landmark: addressForm.landmark.trim(),
      city: addressForm.city.trim(),
      state: addressForm.state.trim(),
      pinCode: addressForm.pinCode.trim(),
      addressType:
        addressForm.addressType || "Home",
    };

    if (
      !cleanedAddress.fullName ||
      !cleanedAddress.phone ||
      !cleanedAddress.houseNo ||
      !cleanedAddress.area ||
      !cleanedAddress.city ||
      !cleanedAddress.state ||
      !cleanedAddress.pinCode
    ) {
      setError(
        "Please fill in all required address fields."
      );
      return;
    }

    if (cleanedAddress.fullName.length < 2) {
      setError(
        "Please enter a valid recipient name."
      );
      return;
    }

    if (!/^\d{10}$/.test(cleanedAddress.phone)) {
      setError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (!/^\d{6}$/.test(cleanedAddress.pinCode)) {
      setError(
        "Please enter a valid 6-digit PIN code."
      );
      return;
    }

    try {
      setSavingAddress(true);
      setError("");
      setSuccess("");

      /*
       * Each saved address has its own:
       * - fullName
       * - phone
       * - houseNo
       * - area
       * - landmark
       * - city
       * - state
       * - pincode
       * - addressType
       *
       * This means different addresses can have
       * different recipients and mobile numbers.
       */
      const addressPayload = {
        fullName: cleanedAddress.fullName,
        phone: cleanedAddress.phone,

        houseNo: cleanedAddress.houseNo,
        area: cleanedAddress.area,
        landmark: cleanedAddress.landmark,
        city: cleanedAddress.city,
        state: cleanedAddress.state,

        pinCode: cleanedAddress.pinCode,
        pincode: cleanedAddress.pinCode,

        addressType:
          cleanedAddress.addressType,
      };

      if (editingAddressId) {
        await updateAddress(
          editingAddressId,
          addressPayload
        );

        setSuccess(
          "Address updated successfully."
        );
      } else {
        await addAddress(addressPayload);

        setSuccess(
          "Address added successfully."
        );
      }

      await loadProfileData();

      setAddressModalOpen(false);
      setEditingAddressId(null);

      setAddressForm({
        ...EMPTY_ADDRESS,
      });
    } catch (requestError) {
      console.error(
        "Failed to save address:",
        requestError
      );

      setError(
        requestError.message ||
          "Unable to save your address."
      );
    } finally {
      setSavingAddress(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    if (!addressId) return;

    try {
      setError("");
      setSuccess("");

      await setDefaultAddress(addressId);
      await loadProfileData();

      setSuccess("Default address updated.");
    } catch (requestError) {
      console.error(
        "Failed to set default address:",
        requestError
      );

      setError(
        requestError.message ||
          "Unable to update the default address."
      );
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!addressId) return;

    const shouldDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!shouldDelete) return;

    try {
      setError("");
      setSuccess("");

      await deleteAddress(addressId);
      await loadProfileData();

      setSuccess(
        "Address deleted successfully."
      );
    } catch (requestError) {
      console.error(
        "Failed to delete address:",
        requestError
      );

      setError(
        requestError.message ||
          "Unable to delete this address."
      );
    }
  };

  const fullName =
    profile?.fullName ||
    profile?.name ||
    "NMB Customer";

  const phone =
    profile?.phone ||
    profile?.mobileNumber ||
    profile?.number ||
    "Not available";

  const email =
    profile?.email || "Not added";

  const getAddressId = (address) => {
    return String(
      address?._id ||
        address?.id ||
        ""
    );
  };

  const isDefaultAddress = (address) => {
    return (
      address?.isDefault === true ||
      address?.default === true
    );
  };

  const getAddressType = (address) => {
    return (
      address?.addressType ||
      address?.type ||
      "Home"
    );
  };

  const getAddressName = (address) => {
    return (
      address?.fullName ||
      address?.name ||
      "Recipient"
    );
  };

  const getAddressPhone = (address) => {
    return (
      address?.phone ||
      address?.mobileNumber ||
      address?.number ||
      ""
    );
  };

  const formatAddress = (address) => {
    if (!address) {
      return "No address available";
    }

    return [
      address.houseNo,
      address.area,
      address.landmark,
      address.city,
      address.state,
      address.pinCode ||
        address.pincode ||
        address.postalCode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FFF9F2] px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
        <div className="mx-auto max-w-[1280px]">
          {/* Page Heading */}
          <div className="mb-9">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A45C]">
              My Account
            </p>

            <h1 className="mt-3 font-[var(--font-display)] text-[38px] leading-tight text-[#340C48] sm:text-[48px]">
              Account Details
            </h1>

            <p className="mt-3 max-w-[520px] text-[13px] leading-6 text-[#6E6670] sm:text-[14px]">
              Manage your personal information and
              saved addresses.
            </p>
          </div>

          {/* Messages */}
          {error &&
            !profileModalOpen &&
            !addressModalOpen && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                {error}
              </div>
            )}

          {success && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-[13px] text-green-700">
              {success}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
            {/* Sidebar */}
            <aside className="h-fit rounded-[14px] border border-[#E9DFE9] bg-white p-3 shadow-[0_8px_25px_rgba(52,12,72,0.04)]">
              <div className="space-y-1">
                <Link
                  to="/orders"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-[12px] font-medium text-[#6E6670] transition hover:bg-[#F8F1F8] hover:text-[#340C48]"
                >
                  <ClipboardList
                    size={16}
                    strokeWidth={1.7}
                  />

                  <span>My Orders</span>

                  <ChevronRight
                    size={14}
                    className="ml-auto"
                  />
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-3 rounded-lg bg-[#F0E9F2] px-3 py-3 text-[12px] font-semibold text-[#340C48]"
                >
                  <UserRound
                    size={16}
                    strokeWidth={1.7}
                  />

                  <span>Account Details</span>
                </Link>

                <a
                  href="#addresses"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-[12px] font-medium text-[#6E6670] transition hover:bg-[#F8F1F8] hover:text-[#340C48]"
                >
                  <MapPin
                    size={16}
                    strokeWidth={1.7}
                  />

                  <span>Saved Addresses</span>

                  <ChevronRight
                    size={14}
                    className="ml-auto"
                  />
                </a>
              </div>

              <div className="my-3 border-t border-[#EEE6EE]" />

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[12px] font-medium text-[#D94B4B] transition hover:bg-red-50"
              >
                <LogOut
                  size={16}
                  strokeWidth={1.7}
                />

                <span>Logout</span>
              </button>
            </aside>

            {/* Main Content */}
            <section className="min-w-0">
              {/* Personal Information */}
              <div className="rounded-[14px] border border-[#E9DFE9] bg-white p-5 shadow-[0_8px_25px_rgba(52,12,72,0.04)] sm:p-7">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5EBD8] text-[#A77D32]">
                      <UserRound
                        size={17}
                        strokeWidth={1.7}
                      />
                    </div>

                    <h2 className="font-[var(--font-display)] text-[20px] text-[#340C48]">
                      Personal Information
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={openProfileModal}
                    className="flex items-center gap-1.5 text-[12px] font-semibold text-[#340C48] transition hover:text-[#C9A45C]"
                  >
                    <Pencil size={13} />
                    Edit
                  </button>
                </div>

                {loading ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item}>
                        <div className="h-2.5 w-20 animate-pulse rounded bg-[#EEE6EE]" />

                        <div className="mt-3 h-4 w-36 animate-pulse rounded bg-[#F3EDF3]" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#9A909D]">
                        Full Name
                      </p>

                      <p className="mt-2 text-[13px] font-medium text-[#2B2430]">
                        {fullName}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#9A909D]">
                        Email Address
                      </p>

                      <p className="mt-2 break-words text-[13px] font-medium text-[#2B2430]">
                        {email}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#9A909D]">
                        Phone Number
                      </p>

                      <p className="mt-2 text-[13px] font-medium text-[#2B2430]">
                        {phone}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#9A909D]">
                        Account Status
                      </p>

                      <p className="mt-2 text-[13px] font-medium text-[#2B2430]">
                        Active
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Orders and Addresses */}
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {/* Orders Card */}
                <Link
                  to="/orders"
                  className="group rounded-[14px] border border-[#E9DFE9] bg-white p-6 shadow-[0_8px_25px_rgba(52,12,72,0.04)] transition hover:-translate-y-0.5 hover:border-[#C9A45C]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0E9F2] text-[#340C48]">
                      <ClipboardList
                        size={19}
                        strokeWidth={1.7}
                      />
                    </div>

                    <ChevronRight
                      size={18}
                      className="text-[#A79BAA] transition group-hover:translate-x-1 group-hover:text-[#340C48]"
                    />
                  </div>

                  <h3 className="mt-5 font-[var(--font-display)] text-[22px] text-[#340C48]">
                    My Orders
                  </h3>

                  <p className="mt-2 text-[12px] leading-5 text-[#6E6670]">
                    View your order history and track
                    your purchases.
                  </p>
                </Link>

                {/* Address Summary Card */}
                <div className="rounded-[14px] border border-[#E9DFE9] bg-white p-6 shadow-[0_8px_25px_rgba(52,12,72,0.04)]">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5EBD8] text-[#A77D32]">
                      <MapPin
                        size={19}
                        strokeWidth={1.7}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={openAddAddressModal}
                      className="flex items-center gap-1 text-[12px] font-semibold text-[#340C48] transition hover:text-[#C9A45C]"
                    >
                      <Plus size={14} />
                      Add
                    </button>
                  </div>

                  <h3 className="mt-5 font-[var(--font-display)] text-[22px] text-[#340C48]">
                    Saved Addresses
                  </h3>

                  {loading ? (
                    <div className="mt-3 h-4 w-full animate-pulse rounded bg-[#F3EDF3]" />
                  ) : addresses.length > 0 ? (
                    <div className="mt-3 space-y-4">
                      {addresses
                        .slice(0, 2)
                        .map((address, index) => (
                          <div
                            key={
                              getAddressId(address) ||
                              index
                            }
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-[12px] font-semibold text-[#340C48]">
                                {getAddressName(
                                  address
                                )}
                              </p>

                              <span className="rounded-full bg-[#F0E9F2] px-2 py-0.5 text-[9px] font-semibold text-[#340C48]">
                                {getAddressType(
                                  address
                                )}
                              </span>
                            </div>

                            {getAddressPhone(address) && (
                              <p className="mt-1 text-[10px] font-medium text-[#8A828C]">
                                {getAddressPhone(
                                  address
                                )}
                              </p>
                            )}

                            <p className="mt-1 text-[12px] leading-5 text-[#6E6670]">
                              {formatAddress(
                                address
                              )}
                            </p>

                            {isDefaultAddress(
                              address
                            ) && (
                              <span className="mt-1 inline-block text-[10px] font-semibold text-[#A77D32]">
                                Default address
                              </span>
                            )}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-[12px] leading-5 text-[#6E6670]">
                      No saved addresses yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Complete Address Management */}
              <div
                id="addresses"
                className="mt-6 rounded-[14px] border border-[#E9DFE9] bg-white p-5 shadow-[0_8px_25px_rgba(52,12,72,0.04)] sm:p-7"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A45C]">
                      Delivery
                    </p>

                    <h2 className="mt-2 font-[var(--font-display)] text-[24px] text-[#340C48]">
                      Saved Addresses
                    </h2>

                    <p className="mt-1 text-[11px] leading-5 text-[#6E6670]">
                      Each address can have its own
                      recipient name and mobile number.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openAddAddressModal}
                    className="flex items-center gap-2 rounded-lg bg-[#340C48] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#4B1D63]"
                  >
                    <Plus size={15} />
                    Add Address
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {loading ? (
                    <div className="h-20 animate-pulse rounded-xl bg-[#F5F0F5]" />
                  ) : addresses.length > 0 ? (
                    addresses.map((address, index) => {
                      const addressId =
                        getAddressId(address);

                      const recipientPhone =
                        getAddressPhone(address);

                      return (
                        <div
                          key={
                            addressId || index
                          }
                          className="rounded-xl border border-[#EEE6EE] p-4"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex min-w-0 gap-3">
                              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5EBD8] text-[#A77D32]">
                                <MapPin size={15} />
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-[13px] font-semibold text-[#340C48]">
                                    {getAddressName(
                                      address
                                    )}
                                  </p>

                                  <span className="rounded-full bg-[#F0E9F2] px-2 py-1 text-[9px] font-semibold text-[#340C48]">
                                    {getAddressType(
                                      address
                                    )}
                                  </span>

                                  {isDefaultAddress(
                                    address
                                  ) && (
                                    <span className="rounded-full bg-[#F5EBD8] px-2 py-1 text-[9px] font-semibold text-[#8A6428]">
                                      Default
                                    </span>
                                  )}
                                </div>

                                {recipientPhone && (
                                  <p className="mt-1 text-[11px] font-medium text-[#4C444E]">
                                    {recipientPhone}
                                  </p>
                                )}

                                <p className="mt-2 max-w-[560px] text-[12px] leading-5 text-[#6E6670]">
                                  {formatAddress(
                                    address
                                  )}
                                </p>

                                {address?.landmark && (
                                  <p className="mt-1 text-[10px] text-[#8A828C]">
                                    Landmark:{" "}
                                    {
                                      address.landmark
                                    }
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pl-11 sm:pl-0">
                              {!isDefaultAddress(
                                address
                              ) && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSetDefault(
                                      addressId
                                    )
                                  }
                                  className="text-[11px] font-semibold text-[#340C48] hover:text-[#C9A45C]"
                                >
                                  Set Default
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  openEditAddressModal(
                                    address
                                  )
                                }
                                className="flex items-center gap-1 text-[11px] font-semibold text-[#340C48] hover:text-[#C9A45C]"
                              >
                                <Edit3 size={13} />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteAddress(
                                    addressId
                                  )
                                }
                                className="flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={13} />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-xl border border-dashed border-[#DCCFDF] px-5 py-8 text-center">
                      <MapPin
                        size={24}
                        className="mx-auto text-[#C9A45C]"
                      />

                      <p className="mt-3 text-[13px] font-semibold text-[#340C48]">
                        No saved addresses
                      </p>

                      <p className="mt-1 text-[12px] text-[#6E6670]">
                        Add an address for faster
                        checkout.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="mt-8 flex items-center gap-2 text-[12px] font-semibold text-[#D94B4B] transition hover:text-red-700"
              >
                <LogOut size={15} />
                Logout from your account
              </button>
            </section>
          </div>
        </div>
      </main>

      <Footer />

      {/* Edit Profile Modal */}
      {profileModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeProfileModal();
            }
          }}
        >
          <div className="relative w-full max-w-[460px] rounded-[20px] bg-[#FFF9F2] p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={closeProfileModal}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-[#340C48]/10 text-[#340C48] hover:bg-[#340C48] hover:text-white"
            >
              <X size={16} />
            </button>

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A45C]">
              Account Settings
            </p>

            <h2 className="mt-2 font-[var(--font-display)] text-[28px] text-[#340C48]">
              Edit Profile
            </h2>

            <p className="mt-2 text-[12px] leading-5 text-[#6E6670]">
              Update your personal information below.
            </p>

            <form
              onSubmit={handleProfileSubmit}
              className="mt-6 space-y-4"
            >
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-[11px] font-semibold text-[#2B2430]"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={profileForm.fullName}
                  onChange={handleProfileInput}
                  placeholder="Enter your full name"
                  className="h-12 w-full rounded-lg border border-[#DED4E2] bg-white px-4 text-[13px] text-[#2B2430] outline-none focus:border-[#340C48] focus:ring-2 focus:ring-[#340C48]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[11px] font-semibold text-[#2B2430]"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={handleProfileInput}
                  placeholder="Enter your email address"
                  className="h-12 w-full rounded-lg border border-[#DED4E2] bg-white px-4 text-[13px] text-[#2B2430] outline-none focus:border-[#340C48] focus:ring-2 focus:ring-[#340C48]/10"
                />
              </div>

              {error && (
                <p className="text-[12px] leading-5 text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={savingProfile}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#340C48] text-[13px] font-semibold text-white transition hover:bg-[#4B1D63] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingProfile ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Address Modal */}
      {addressModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-8 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeAddressModal();
            }
          }}
        >
          <div className="relative w-full max-w-[560px] rounded-[20px] bg-[#FFF9F2] p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={closeAddressModal}
              disabled={savingAddress}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-[#340C48]/10 text-[#340C48] hover:bg-[#340C48] hover:text-white disabled:opacity-50"
            >
              <X size={16} />
            </button>

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A45C]">
              Delivery Address
            </p>

            <h2 className="mt-2 font-[var(--font-display)] text-[28px] text-[#340C48]">
              {editingAddressId
                ? "Edit Address"
                : "Add Address"}
            </h2>

            <p className="mt-2 max-w-[430px] text-[12px] leading-5 text-[#6E6670]">
              Enter the recipient details for this
              specific address. Different saved
              addresses can have different names and
              mobile numbers.
            </p>

            <form
              onSubmit={handleAddressSubmit}
              className="mt-6 space-y-4"
            >
              {/* Recipient Details */}
              <div className="rounded-xl border border-[#E9DFE9] bg-white p-4">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#A77D32]">
                  Recipient Details
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="address-fullName"
                      className="mb-2 block text-[11px] font-semibold text-[#2B2430]"
                    >
                      Full Name *
                    </label>

                    <input
                      id="address-fullName"
                      name="fullName"
                      type="text"
                      value={addressForm.fullName}
                      onChange={handleAddressInput}
                      placeholder="Recipient full name"
                      autoComplete="name"
                      className="h-11 w-full rounded-lg border border-[#DED4E2] bg-white px-4 text-[13px] outline-none focus:border-[#340C48] focus:ring-2 focus:ring-[#340C48]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address-phone"
                      className="mb-2 block text-[11px] font-semibold text-[#2B2430]"
                    >
                      Mobile Number *
                    </label>

                    <input
                      id="address-phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={addressForm.phone}
                      onChange={handleAddressInput}
                      placeholder="10-digit mobile number"
                      autoComplete="tel"
                      className="h-11 w-full rounded-lg border border-[#DED4E2] bg-white px-4 text-[13px] outline-none focus:border-[#340C48] focus:ring-2 focus:ring-[#340C48]/10"
                    />
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div>
                <label
                  htmlFor="houseNo"
                  className="mb-2 block text-[11px] font-semibold text-[#2B2430]"
                >
                  House / Flat / Building *
                </label>

                <input
                  id="houseNo"
                  name="houseNo"
                  type="text"
                  value={addressForm.houseNo}
                  onChange={handleAddressInput}
                  placeholder="Enter house or flat number"
                  autoComplete="street-address"
                  className="h-11 w-full rounded-lg border border-[#DED4E2] bg-white px-4 text-[13px] outline-none focus:border-[#340C48] focus:ring-2 focus:ring-[#340C48]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="area"
                  className="mb-2 block text-[11px] font-semibold text-[#2B2430]"
                >
                  Area / Street *
                </label>

                <input
                  id="area"
                  name="area"
                  type="text"
                  value={addressForm.area}
                  onChange={handleAddressInput}
                  placeholder="Enter area or street"
                  className="h-11 w-full rounded-lg border border-[#DED4E2] bg-white px-4 text-[13px] outline-none focus:border-[#340C48] focus:ring-2 focus:ring-[#340C48]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="landmark"
                  className="mb-2 block text-[11px] font-semibold text-[#2B2430]"
                >
                  Landmark
                  <span className="ml-1 font-normal text-[#9A909D]">
                    (Optional)
                  </span>
                </label>

                <input
                  id="landmark"
                  name="landmark"
                  type="text"
                  value={addressForm.landmark}
                  onChange={handleAddressInput}
                  placeholder="Nearby landmark"
                  className="h-11 w-full rounded-lg border border-[#DED4E2] bg-white px-4 text-[13px] outline-none focus:border-[#340C48] focus:ring-2 focus:ring-[#340C48]/10"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-[11px] font-semibold text-[#2B2430]"
                  >
                    City *
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={addressForm.city}
                    onChange={handleAddressInput}
                    placeholder="Enter city"
                    autoComplete="address-level2"
                    className="h-11 w-full rounded-lg border border-[#DED4E2] bg-white px-4 text-[13px] outline-none focus:border-[#340C48] focus:ring-2 focus:ring-[#340C48]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="mb-2 block text-[11px] font-semibold text-[#2B2430]"
                  >
                    State *
                  </label>

                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={addressForm.state}
                    onChange={handleAddressInput}
                    placeholder="Enter state"
                    autoComplete="address-level1"
                    className="h-11 w-full rounded-lg border border-[#DED4E2] bg-white px-4 text-[13px] outline-none focus:border-[#340C48] focus:ring-2 focus:ring-[#340C48]/10"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="pinCode"
                    className="mb-2 block text-[11px] font-semibold text-[#2B2430]"
                  >
                    PIN Code *
                  </label>

                  <input
                    id="pinCode"
                    name="pinCode"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={addressForm.pinCode}
                    onChange={handleAddressInput}
                    placeholder="6-digit PIN code"
                    autoComplete="postal-code"
                    className="h-11 w-full rounded-lg border border-[#DED4E2] bg-white px-4 text-[13px] outline-none focus:border-[#340C48] focus:ring-2 focus:ring-[#340C48]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="addressType"
                    className="mb-2 block text-[11px] font-semibold text-[#2B2430]"
                  >
                    Address Type
                  </label>

                  <select
                    id="addressType"
                    name="addressType"
                    value={addressForm.addressType}
                    onChange={handleAddressInput}
                    className="h-11 w-full rounded-lg border border-[#DED4E2] bg-white px-4 text-[13px] text-[#2B2430] outline-none focus:border-[#340C48] focus:ring-2 focus:ring-[#340C48]/10"
                  >
                    <option value="Home">
                      Home
                    </option>
                    <option value="Work">
                      Work
                    </option>
                    <option value="Office">
                      Office
                    </option>
                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                  <p className="text-[12px] leading-5 text-red-600">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={savingAddress}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#340C48] text-[13px] font-semibold text-white transition hover:bg-[#4B1D63] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingAddress ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    {editingAddressId
                      ? "Update Address"
                      : "Save Address"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
