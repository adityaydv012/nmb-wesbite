import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  Image as ImageIcon,
  GripVertical,
  Check,
  AlertCircle,
} from "lucide-react";

import AdminLayout from "../components/admin/AdminLayout";

import {
  getAdminShowcaseSweets,
  createShowcaseSweet,
  updateShowcaseSweet,
  updateShowcaseSweetStatus,
  deleteShowcaseSweet,
} from "../services/showcaseSweetApi";

const CATEGORY_OPTIONS = [
  "Kaju Sweets",
  "Milk Sweets",
  "Besan & Laddu",
  "Ghee Sweets",
  "Dry Fruit Sweets",
];

const DIETARY_OPTIONS = [
  "Sugar-Free",
  "Vegan",
  "Gluten-Free",
  "Vegetarian",
];

const emptyForm = {
  name: "",
  description: "",
  category: "",
  images: [""],
  badge: "",
  dietary: [],
  displayOrder: 0,
  isActive: true,
};

const AdminCategories = () => {
  const [sweets, setSweets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // LOAD SWEETS
  // ==========================================

  const loadSweets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminShowcaseSweets();

      setSweets(response?.sweets || []);
    } catch (err) {
      console.error("Load showcase sweets error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load sweets."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSweets();
  }, []);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredSweets = useMemo(() => {
    let result = [...sweets];

    const searchValue = search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((sweet) => {
        return (
          sweet.name?.toLowerCase().includes(searchValue) ||
          sweet.category?.toLowerCase().includes(searchValue) ||
          sweet.description?.toLowerCase().includes(searchValue)
        );
      });
    }

    if (categoryFilter !== "All") {
      result = result.filter(
        (sweet) => sweet.category === categoryFilter
      );
    }

    return result;
  }, [sweets, search, categoryFilter]);

  // ==========================================
  // FORM HELPERS
  // ==========================================

  const openAddModal = () => {
    setEditingSweet(null);
    setForm({
      ...emptyForm,
      images: [""],
    });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEditModal = (sweet) => {
    setEditingSweet(sweet);

    setForm({
      name: sweet.name || "",
      description: sweet.description || "",
      category: sweet.category || "",
      images:
        Array.isArray(sweet.images) && sweet.images.length > 0
          ? [...sweet.images]
          : [""],
      badge: sweet.badge || "",
      dietary: Array.isArray(sweet.dietary)
        ? [...sweet.dietary]
        : [],
      displayOrder: sweet.displayOrder ?? 0,
      isActive: sweet.isActive !== false,
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingSweet(null);
    setForm({
      ...emptyForm,
      images: [""],
    });
    setError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // IMAGE URLS
  // ==========================================

  const addImageField = () => {
    setForm((previous) => ({
      ...previous,
      images: [...previous.images, ""],
    }));
  };

  const removeImageField = (index) => {
    setForm((previous) => {
      const images = [...previous.images];

      if (images.length === 1) {
        images[0] = "";
      } else {
        images.splice(index, 1);
      }

      return {
        ...previous,
        images,
      };
    });
  };

  const updateImageField = (index, value) => {
    setForm((previous) => {
      const images = [...previous.images];
      images[index] = value;

      return {
        ...previous,
        images,
      };
    });
  };

  // ==========================================
  // DIETARY
  // ==========================================

  const toggleDietary = (value) => {
    setForm((previous) => {
      const exists = previous.dietary.includes(value);

      return {
        ...previous,
        dietary: exists
          ? previous.dietary.filter((item) => item !== value)
          : [...previous.dietary, value],
      };
    });
  };

  // ==========================================
  // SAVE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanedImages = form.images
      .map((image) => image.trim())
      .filter(Boolean);

    if (!form.name.trim()) {
      setError("Sweet name is required.");
      return;
    }

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    if (cleanedImages.length === 0) {
      setError("At least one image URL is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),

        description: form.description.trim(),

        category: form.category,

        images: cleanedImages,

        badge: form.badge.trim(),

        dietary: form.dietary,

        displayOrder: Number(form.displayOrder) || 0,

        isActive: Boolean(form.isActive),
      };

      if (editingSweet) {
        await updateShowcaseSweet(
          editingSweet._id,
          payload
        );

        setSuccess("Sweet updated successfully.");
      } else {
        await createShowcaseSweet(payload);

        setSuccess("Sweet added successfully.");
      }

      await loadSweets();

      setTimeout(() => {
        closeModal();
      }, 500);
    } catch (err) {
      console.error("Save showcase sweet error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to save sweet."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // STATUS
  // ==========================================

  const handleStatusChange = async (sweet) => {
    try {
      setError("");

      await updateShowcaseSweetStatus(
        sweet._id,
        !sweet.isActive
      );

      setSweets((previous) =>
        previous.map((item) =>
          item._id === sweet._id
            ? {
                ...item,
                isActive: !item.isActive,
              }
            : item
        )
      );
    } catch (err) {
      console.error("Update sweet status error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update sweet status."
      );
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (sweet) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${sweet.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteShowcaseSweet(sweet._id);

      setSweets((previous) =>
        previous.filter(
          (item) => item._id !== sweet._id
        )
      );

      setSuccess("Sweet deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (err) {
      console.error("Delete sweet error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete sweet."
      );
    }
  };

  // ==========================================
  // IMAGE PREVIEW
  // ==========================================

  const getFirstImage = (sweet) => {
    if (
      Array.isArray(sweet.images) &&
      sweet.images.length > 0
    ) {
      return sweet.images[0];
    }

    return "";
  };

  return (
    <AdminLayout>
      <div className="min-h-full bg-[#faf7f2] p-4 md:p-6 lg:p-8">
        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-[#340C48] md:text-3xl">
                Categories
              </h1>

              <span className="rounded-full bg-[#eadcf0] px-3 py-1 text-xs font-semibold text-[#340C48]">
                Showcase
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Manage sweets displayed on the customer All
              Sweets page.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#340C48] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#481762]"
          >
            <Plus size={18} />
            Add Sweet
          </button>
        </div>

        {/* ======================================
            INFO
        ====================================== */}

        <div className="mb-6 rounded-2xl border border-[#e7d9eb] bg-[#f4eaf7] p-4">
          <div className="flex gap-3">
            <div className="mt-0.5">
              <AlertCircle
                size={19}
                className="text-[#6a267f]"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#340C48]">
                Showcase sweets only
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-600">
                These sweets are for display on the website.
                They do not have prices, weights, or add-to-cart
                functionality.
              </p>
            </div>
          </div>
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
            FILTERS
        ====================================== */}

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_220px]">
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
                  setSearch(e.target.value)
                }
                placeholder="Search sweets..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#340C48] focus:bg-white"
              />
            </div>

            {/* Category */}

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#340C48]"
            >
              <option value="All">All Categories</option>

              {CATEGORY_OPTIONS.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ======================================
            CONTENT
        ====================================== */}

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className="h-48 animate-pulse bg-gray-200" />

                <div className="space-y-3 p-4">
                  <div className="h-4 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
                  <div className="h-8 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredSweets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f0e4f3]">
              <ImageIcon
                size={25}
                className="text-[#340C48]"
              />
            </div>

            <h2 className="text-xl font-semibold text-[#340C48]">
              No showcase sweets
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Add your first sweet and it will automatically
              appear on the customer All Sweets page.
            </p>

            <button
              type="button"
              onClick={openAddModal}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#340C48] px-5 py-3 text-sm font-semibold text-white"
            >
              <Plus size={17} />
              Add First Sweet
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSweets.map((sweet) => (
              <div
                key={sweet._id}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${
                  sweet.isActive
                    ? "border-gray-200"
                    : "border-gray-300 opacity-70"
                }`}
              >
                {/* Image */}

                <div className="relative h-52 bg-gray-100">
                  {getFirstImage(sweet) ? (
                    <img
                      src={getFirstImage(sweet)}
                      alt={sweet.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <ImageIcon size={35} />
                    </div>
                  )}

                  {/* Badge */}

                  {sweet.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#340C48] px-3 py-1 text-[11px] font-semibold text-white">
                      {sweet.badge}
                    </span>
                  )}

                  {/* Status */}

                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold ${
                      sweet.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {sweet.isActive
                      ? "Active"
                      : "Hidden"}
                  </span>
                </div>

                {/* Content */}

                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8b5a9c]">
                        {sweet.category}
                      </p>

                      <h3 className="mt-1 line-clamp-1 text-base font-semibold text-[#340C48]">
                        {sweet.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <GripVertical size={14} />
                      {sweet.displayOrder ?? 0}
                    </div>
                  </div>

                  <p className="mb-3 line-clamp-2 min-h-[40px] text-xs leading-5 text-gray-500">
                    {sweet.description ||
                      "No description added."}
                  </p>

                  {/* Dietary */}

                  {Array.isArray(sweet.dietary) &&
                    sweet.dietary.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {sweet.dietary.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-[#f4eaf7] px-2 py-1 text-[10px] font-medium text-[#5d286e]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}

                  {/* Actions */}

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(sweet)
                      }
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(sweet)
                      }
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-2 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      {sweet.isActive ? (
                        <>
                          <EyeOff size={14} />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye size={14} />
                          Show
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(sweet)
                      }
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-red-100 px-2 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ======================================
            ADD / EDIT MODAL
        ====================================== */}

        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Modal Header */}

              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 md:px-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#340C48]">
                    {editingSweet
                      ? "Edit Showcase Sweet"
                      : "Add Showcase Sweet"}
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    This sweet will appear on the customer
                    All Sweets page.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <X size={19} />
                </button>
              </div>

              {/* Modal Body */}

              <form
                onSubmit={handleSubmit}
                className="overflow-y-auto"
              >
                <div className="space-y-6 p-5 md:p-6">
                  {/* Name */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Sweet Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Kaju Katli"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#340C48]"
                    />
                  </div>

                  {/* Description */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Write a short description about this sweet..."
                      className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#340C48]"
                    />
                  </div>

                  {/* Category + Order */}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Category
                      </label>

                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#340C48]"
                      >
                        <option value="">
                          Select category
                        </option>

                        {CATEGORY_OPTIONS.map(
                          (category) => (
                            <option
                              key={category}
                              value={category}
                            >
                              {category}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Display Order
                      </label>

                      <input
                        type="number"
                        name="displayOrder"
                        min="0"
                        value={form.displayOrder}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#340C48]"
                      />

                      <p className="mt-1 text-[11px] text-gray-400">
                        Lower numbers appear first.
                      </p>
                    </div>
                  </div>

                  {/* Badge */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Badge
                    </label>

                    <input
                      type="text"
                      name="badge"
                      value={form.badge}
                      onChange={handleChange}
                      placeholder="e.g. Bestseller, Signature, Festive Special"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#340C48]"
                    />
                  </div>

                  {/* Images */}

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-semibold text-gray-700">
                        Sweet Images
                      </label>

                      <button
                        type="button"
                        onClick={addImageField}
                        className="flex items-center gap-1 text-xs font-semibold text-[#340C48]"
                      >
                        <Plus size={14} />
                        Add Image
                      </button>
                    </div>

                    <div className="space-y-3">
                      {form.images.map(
                        (image, index) => (
                          <div
                            key={index}
                            className="flex gap-2"
                          >
                            <div className="relative flex-1">
                              <ImageIcon
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                              />

                              <input
                                type="url"
                                value={image}
                                onChange={(e) =>
                                  updateImageField(
                                    index,
                                    e.target.value
                                  )
                                }
                                placeholder={`Image URL ${index + 1}`}
                                className="w-full rounded-xl border border-gray-200 py-3 pl-9 pr-4 text-sm outline-none focus:border-[#340C48]"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                removeImageField(
                                  index
                                )
                              }
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 text-red-500 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )
                      )}
                    </div>

                    <p className="mt-2 text-[11px] leading-5 text-gray-400">
                      Add image URLs for now. Multiple images
                      are supported. File upload can be added
                      later using Cloudinary or S3.
                    </p>
                  </div>

                  {/* Dietary */}

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-gray-700">
                      Dietary Tags
                    </label>

                    <div className="flex flex-wrap gap-2">
                      {DIETARY_OPTIONS.map(
                        (option) => {
                          const selected =
                            form.dietary.includes(
                              option
                            );

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                toggleDietary(
                                  option
                                )
                              }
                              className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition ${
                                selected
                                  ? "border-[#340C48] bg-[#340C48] text-white"
                                  : "border-gray-200 bg-white text-gray-600 hover:border-[#340C48]"
                              }`}
                            >
                              {selected && (
                                <Check size={13} />
                              )}

                              {option}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Active */}

                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <label className="flex cursor-pointer items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          Show on website
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          When enabled, this sweet will be
                          visible on the customer All Sweets
                          page.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        name="isActive"
                        checked={form.isActive}
                        onChange={handleChange}
                        className="h-5 w-5 accent-[#340C48]"
                      />
                    </label>
                  </div>
                </div>

                {/* Modal Footer */}

                <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end md:px-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-[#340C48] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#481762] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : editingSweet
                      ? "Update Sweet"
                      : "Add Sweet"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;