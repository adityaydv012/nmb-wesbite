import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Package,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ImagePlus,
  Eye,
} from "lucide-react";

import AdminLayout from "../components/admin/AdminLayout";
import adminApi from "../services/adminApi";

const emptyVariety = {
  weight: "",
  sellingPrice: "",
  offerPrice: "",
  stock: "",
  isAvailable: true,
};

const emptyForm = {
  name: "",
  description: "",
  category: "",
  images: [""],
  varieties: [{ ...emptyVariety }],
  isActive: true,
};

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};

const getDiscountPercentage = (sellingPrice, offerPrice) => {
  const selling = Number(sellingPrice);
  const offer = Number(offerPrice);

  if (
    !Number.isFinite(selling) ||
    !Number.isFinite(offer) ||
    selling <= 0 ||
    offer <= 0 ||
    offer >= selling
  ) {
    return 0;
  }

  return Math.round(((selling - offer) / selling) * 100);
};

const getDisplayPrice = (variety) => {
  const sellingPrice = Number(
    variety.sellingPrice ?? variety.price ?? 0
  );

  const offerPrice =
    variety.offerPrice === null ||
    variety.offerPrice === undefined ||
    variety.offerPrice === ""
      ? null
      : Number(variety.offerPrice);

  const hasOffer =
    offerPrice !== null &&
    Number.isFinite(offerPrice) &&
    offerPrice > 0 &&
    offerPrice < sellingPrice;

  return {
    sellingPrice,
    offerPrice: hasOffer ? offerPrice : null,
    hasOffer,
    discount: hasOffer
      ? getDiscountPercentage(sellingPrice, offerPrice)
      : 0,
  };
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingProduct, setEditingProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [statusUpdatingId, setStatusUpdatingId] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminApi.get("/admin/products");

      setProducts(response.data.products || []);
    } catch (err) {
      console.error("Fetch products error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to fetch products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm({
      ...emptyForm,
      images: [""],
      varieties: [{ ...emptyVariety }],
    });
    setError("");
    setSuccessMessage("");
    setShowModal(true);
  };

  const openEditModal = (product) => {
    const existingImages =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : product.image
        ? [product.image]
        : [""];

    const existingVarieties =
      Array.isArray(product.varieties) &&
      product.varieties.length > 0
        ? product.varieties.map((variety) => ({
            weight: variety.weight || "",
            sellingPrice:
              variety.sellingPrice ?? variety.price ?? "",
            offerPrice: variety.offerPrice ?? "",
            stock: variety.stock ?? "",
            isAvailable: variety.isAvailable !== false,
          }))
        : [{ ...emptyVariety }];

    setEditingProduct(product);

    setForm({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      images: existingImages,
      varieties: existingVarieties,
      isActive: product.isActive !== false,
    });

    setError("");
    setSuccessMessage("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingProduct(null);
    setForm({
      ...emptyForm,
      images: [""],
      varieties: [{ ...emptyVariety }],
    });
    setError("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (index, value) => {
    setForm((previous) => {
      const updatedImages = [...previous.images];
      updatedImages[index] = value;

      return {
        ...previous,
        images: updatedImages,
      };
    });
  };

  const addImageField = () => {
    setForm((previous) => ({
      ...previous,
      images: [...previous.images, ""],
    }));
  };

  const removeImageField = (index) => {
    setForm((previous) => {
      if (previous.images.length === 1) {
        return {
          ...previous,
          images: [""],
        };
      }

      return {
        ...previous,
        images: previous.images.filter(
          (_, imageIndex) => imageIndex !== index
        ),
      };
    });
  };

  const handleVarietyChange = (index, field, value) => {
    setForm((previous) => {
      const updatedVarieties = [...previous.varieties];

      updatedVarieties[index] = {
        ...updatedVarieties[index],
        [field]: value,
      };

      return {
        ...previous,
        varieties: updatedVarieties,
      };
    });
  };

  const addVariety = () => {
    setForm((previous) => ({
      ...previous,
      varieties: [
        ...previous.varieties,
        {
          ...emptyVariety,
        },
      ],
    }));
  };

  const removeVariety = (index) => {
    setForm((previous) => {
      if (previous.varieties.length === 1) {
        return previous;
      }

      return {
        ...previous,
        varieties: previous.varieties.filter(
          (_, varietyIndex) => varietyIndex !== index
        ),
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.category.trim()) {
      setError("Product category is required.");
      return;
    }

    const validImages = form.images
      .map((image) => image.trim())
      .filter(Boolean);

    const validVarieties = form.varieties
      .map((variety) => {
        const sellingPrice = Number(variety.sellingPrice);

        const hasOfferInput =
          variety.offerPrice !== "" &&
          variety.offerPrice !== null &&
          variety.offerPrice !== undefined;

        const enteredOfferPrice = hasOfferInput
          ? Number(variety.offerPrice)
          : null;

        const validOfferPrice =
          enteredOfferPrice !== null &&
          Number.isFinite(enteredOfferPrice) &&
          enteredOfferPrice > 0 &&
          enteredOfferPrice < sellingPrice
            ? enteredOfferPrice
            : null;

        return {
          weight: variety.weight.trim(),
          sellingPrice,
          offerPrice: validOfferPrice,
          stock: Number(variety.stock || 0),
          isAvailable: variety.isAvailable,
        };
      })
      .filter(
        (variety) =>
          variety.weight &&
          Number.isFinite(variety.sellingPrice) &&
          variety.sellingPrice >= 0
      );

    if (validVarieties.length === 0) {
      setError("Please add at least one valid product variety.");
      return;
    }

    const invalidOffer = form.varieties.some((variety) => {
      if (
        variety.offerPrice === "" ||
        variety.offerPrice === null ||
        variety.offerPrice === undefined
      ) {
        return false;
      }

      const sellingPrice = Number(variety.sellingPrice);
      const offerPrice = Number(variety.offerPrice);

      return (
        Number.isFinite(offerPrice) &&
        offerPrice > 0 &&
        offerPrice >= sellingPrice
      );
    });

    if (invalidOffer) {
      setError(
        "Offer price must be lower than the selling price."
      );
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      image: validImages[0] || "",
      images: validImages,
      varieties: validVarieties,
      isActive: form.isActive,
    };

    try {
      setSaving(true);

      if (editingProduct) {
        await adminApi.patch(
          `/admin/products/${editingProduct._id}`,
          payload
        );

        setSuccessMessage("Product updated successfully.");
      } else {
        await adminApi.post("/admin/products", payload);

        setSuccessMessage("Product created successfully.");
      }

      await fetchProducts();

      setShowModal(false);
      setEditingProduct(null);
      setForm({
        ...emptyForm,
        images: [""],
        varieties: [{ ...emptyVariety }],
      });
    } catch (err) {
      console.error("Save product error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!shouldDelete) return;

    try {
      setDeletingId(productId);
      setError("");

      await adminApi.delete(`/admin/products/${productId}`);

      setProducts((previous) =>
        previous.filter((product) => product._id !== productId)
      );

      setSuccessMessage("Product deleted successfully.");
    } catch (err) {
      console.error("Delete product error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete product. Please try again."
      );
    } finally {
      setDeletingId("");
    }
  };

  const handleStatusToggle = async (product) => {
    try {
      setStatusUpdatingId(product._id);
      setError("");

      const response = await adminApi.patch(
        `/admin/products/${product._id}/status`,
        {
          isActive: !product.isActive,
        }
      );

      const updatedProduct = response.data.product;

      setProducts((previous) =>
        previous.map((item) =>
          item._id === product._id ? updatedProduct : item
        )
      );

      setSuccessMessage(
        updatedProduct.isActive
          ? "Product activated successfully."
          : "Product deactivated successfully."
      );
    } catch (err) {
      console.error("Update product status error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update product status."
      );
    } finally {
      setStatusUpdatingId("");
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#8b748f]">
              Catalog Management
            </p>

            <h1 className="text-3xl font-bold text-[#241a1c]">
              Products
            </h1>

            <p className="mt-2 text-sm text-[#81747b]">
              Manage sweets, images, varieties, prices, stock, and
              availability.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchProducts}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eadfda] bg-white px-4 py-3 text-sm font-semibold text-[#40134f] transition hover:bg-[#faf6f3]"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#40134f] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#32103f]"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>

        {error && !showModal && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {successMessage && !showModal && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {successMessage}
          </div>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#eadfda] bg-white p-5">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0e5f3] text-[#40134f]">
              <Package size={22} />
            </div>

            <p className="text-sm text-[#81747b]">Total Products</p>

            <p className="mt-1 text-2xl font-bold text-[#241a1c]">
              {products.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#eadfda] bg-white p-5">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <CheckCircle2 size={22} />
            </div>

            <p className="text-sm text-[#81747b]">Active Products</p>

            <p className="mt-1 text-2xl font-bold text-[#241a1c]">
              {products.filter((product) => product.isActive).length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#eadfda] bg-white p-5">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
              <XCircle size={22} />
            </div>

            <p className="text-sm text-[#81747b]">Inactive Products</p>

            <p className="mt-1 text-2xl font-bold text-[#241a1c]">
              {products.filter((product) => !product.isActive).length}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#eadfda] bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-[1050px] w-full">
              <thead>
                <tr className="border-b border-[#eadfda] bg-[#fcfaf8] text-left">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#81747b]">
                    Product
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#81747b]">
                    Category
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#81747b]">
                    Varieties
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#81747b]">
                    Price
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#81747b]">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-[#81747b]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-16 text-center text-sm text-[#81747b]"
                    >
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-16 text-center">
                      <Package
                        size={40}
                        className="mx-auto mb-3 text-[#c8b9c2]"
                      />

                      <p className="font-semibold text-[#241a1c]">
                        No products found
                      </p>

                      <p className="mt-1 text-sm text-[#81747b]">
                        Add your first sweet product to get started.
                      </p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const firstVariety = product.varieties?.[0];
                    const priceData = firstVariety
                      ? getDisplayPrice(firstVariety)
                      : null;

                    return (
                      <tr
                        key={product._id}
                        className="border-b border-[#f0e8e4] last:border-b-0"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-14 w-14 rounded-xl object-cover"
                                onError={(event) => {
                                  event.currentTarget.style.display =
                                    "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f4edf5] text-[#40134f]">
                                <Package size={22} />
                              </div>
                            )}

                            <div>
                              <p className="font-semibold text-[#241a1c]">
                                {product.name}
                              </p>

                              <p className="mt-1 max-w-xs truncate text-xs text-[#81747b]">
                                {product.description ||
                                  "No description added"}
                              </p>

                              <p className="mt-1 text-xs text-[#8b748f]">
                                {product.images?.length || 0} image
                                {product.images?.length === 1
                                  ? ""
                                  : "s"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-[#655961]">
                          {product.category}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {product.varieties?.length ? (
                              product.varieties.map((variety, index) => (
                                <span
                                  key={`${product._id}-${index}`}
                                  className="rounded-lg bg-[#f4edf5] px-2 py-1 text-xs font-semibold text-[#40134f]"
                                >
                                  {variety.weight}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-[#81747b]">
                                No varieties
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          {priceData ? (
                            <div>
                              {priceData.hasOffer && (
                                <p className="text-xs text-[#81747b] line-through">
                                  {formatCurrency(
                                    priceData.sellingPrice
                                  )}
                                </p>
                              )}

                              <p className="text-sm font-bold text-[#40134f]">
                                {formatCurrency(
                                  priceData.hasOffer
                                    ? priceData.offerPrice
                                    : priceData.sellingPrice
                                )}
                              </p>

                              {priceData.hasOffer && (
                                <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                                  {priceData.discount}% OFF
                                </span>
                              )}
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            disabled={
                              statusUpdatingId === product._id
                            }
                            onClick={() => handleStatusToggle(product)}
                            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                              product.isActive
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {statusUpdatingId === product._id
                              ? "Updating..."
                              : product.isActive
                              ? "Active"
                              : "Inactive"}
                          </button>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(product)}
                              className="rounded-lg p-2 text-[#40134f] transition hover:bg-[#f4edf5]"
                              title="Edit product"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              type="button"
                              disabled={deletingId === product._id}
                              onClick={() => handleDelete(product._id)}
                              className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                              title="Delete product"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/40 p-4 md:p-8">
          <div className="my-auto w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#eadfda] px-5 py-4 md:px-7">
              <div>
                <h2 className="text-xl font-bold text-[#241a1c]">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h2>

                <p className="mt-1 text-sm text-[#81747b]">
                  Add images, pricing, varieties, and stock.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-[#81747b] transition hover:bg-[#f7f4f1]"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6 px-5 py-6 md:px-7">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#4c4147]">
                      Product Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="Example: Kaju Katli"
                      className="w-full rounded-xl border border-[#ded2cd] px-4 py-3 text-sm outline-none focus:border-[#40134f] focus:ring-2 focus:ring-[#eadcf0]"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#4c4147]">
                      Category *
                    </label>

                    <input
                      type="text"
                      name="category"
                      value={form.category}
                      onChange={handleInputChange}
                      placeholder="Example: Sweets"
                      className="w-full rounded-xl border border-[#ded2cd] px-4 py-3 text-sm outline-none focus:border-[#40134f] focus:ring-2 focus:ring-[#eadcf0]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#4c4147]">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Write a short product description..."
                    rows="3"
                    className="w-full resize-none rounded-xl border border-[#ded2cd] px-4 py-3 text-sm outline-none focus:border-[#40134f] focus:ring-2 focus:ring-[#eadcf0]"
                  />
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#241a1c]">
                        Product Images
                      </h3>

                      <p className="mt-1 text-xs text-[#81747b]">
                        Add multiple image URLs. The first image is the
                        main product image.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addImageField}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#f4edf5] px-3 py-2 text-xs font-bold text-[#40134f] transition hover:bg-[#eadcf0]"
                    >
                      <ImagePlus size={15} />
                      Add Image
                    </button>
                  </div>

                  <div className="space-y-3">
                    {form.images.map((image, index) => (
                      <div
                        key={index}
                        className="flex gap-2"
                      >
                        <input
                          type="url"
                          value={image}
                          onChange={(event) =>
                            handleImageChange(
                              index,
                              event.target.value
                            )
                          }
                          placeholder={`Image URL ${index + 1}`}
                          className="flex-1 rounded-xl border border-[#ded2cd] px-4 py-3 text-sm outline-none focus:border-[#40134f] focus:ring-2 focus:ring-[#eadcf0]"
                        />

                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="rounded-xl border border-red-200 px-3 text-red-600 transition hover:bg-red-50"
                          title="Remove image"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#241a1c]">
                        Product Varieties
                      </h3>

                      <p className="mt-1 text-xs text-[#81747b]">
                        Offer price is optional. Leave it empty for no
                        discount.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addVariety}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#f4edf5] px-3 py-2 text-xs font-bold text-[#40134f] transition hover:bg-[#eadcf0]"
                    >
                      <Plus size={15} />
                      Add Variety
                    </button>
                  </div>

                  <div className="space-y-4">
                    {form.varieties.map((variety, index) => {
                      const discount = getDiscountPercentage(
                        variety.sellingPrice,
                        variety.offerPrice
                      );

                      return (
                        <div
                          key={index}
                          className="rounded-xl border border-[#eadfda] bg-[#fcfaf8] p-4"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wide text-[#8b748f]">
                              Variety {index + 1}
                            </p>

                            {discount > 0 && (
                              <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                                {discount}% OFF
                              </span>
                            )}
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                            <div>
                              <label className="mb-1.5 block text-xs font-semibold text-[#655961]">
                                Weight
                              </label>

                              <input
                                type="text"
                                value={variety.weight}
                                onChange={(event) =>
                                  handleVarietyChange(
                                    index,
                                    "weight",
                                    event.target.value
                                  )
                                }
                                placeholder="500g"
                                className="w-full rounded-lg border border-[#ded2cd] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#40134f]"
                              />
                            </div>

                            <div>
                              <label className="mb-1.5 block text-xs font-semibold text-[#655961]">
                                Selling Price
                              </label>

                              <input
                                type="number"
                                min="0"
                                value={variety.sellingPrice}
                                onChange={(event) =>
                                  handleVarietyChange(
                                    index,
                                    "sellingPrice",
                                    event.target.value
                                  )
                                }
                                placeholder="900"
                                className="w-full rounded-lg border border-[#ded2cd] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#40134f]"
                              />
                            </div>

                            <div>
                              <label className="mb-1.5 block text-xs font-semibold text-[#655961]">
                                Offer Price
                              </label>

                              <input
                                type="number"
                                min="0"
                                value={variety.offerPrice}
                                onChange={(event) =>
                                  handleVarietyChange(
                                    index,
                                    "offerPrice",
                                    event.target.value
                                  )
                                }
                                placeholder="600 (optional)"
                                className="w-full rounded-lg border border-[#ded2cd] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#40134f]"
                              />
                            </div>

                            <div>
                              <label className="mb-1.5 block text-xs font-semibold text-[#655961]">
                                Stock
                              </label>

                              <input
                                type="number"
                                min="0"
                                value={variety.stock}
                                onChange={(event) =>
                                  handleVarietyChange(
                                    index,
                                    "stock",
                                    event.target.value
                                  )
                                }
                                placeholder="20"
                                className="w-full rounded-lg border border-[#ded2cd] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#40134f]"
                              />
                            </div>

                            <div className="flex items-end gap-2">
                              <label className="flex flex-1 items-center gap-2 rounded-lg border border-[#ded2cd] bg-white px-3 py-2.5 text-xs font-semibold text-[#655961]">
                                <input
                                  type="checkbox"
                                  checked={variety.isAvailable}
                                  onChange={(event) =>
                                    handleVarietyChange(
                                      index,
                                      "isAvailable",
                                      event.target.checked
                                    )
                                  }
                                  className="h-4 w-4 accent-[#40134f]"
                                />
                                Available
                              </label>

                              <button
                                type="button"
                                onClick={() =>
                                  removeVariety(index)
                                }
                                disabled={
                                  form.varieties.length === 1
                                }
                                className="rounded-lg p-2.5 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                                title="Remove variety"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#81747b]">
                            <span>
                              Selling Price:{" "}
                              <strong className="text-[#241a1c]">
                                {formatCurrency(
                                  variety.sellingPrice
                                )}
                              </strong>
                            </span>

                            {variety.offerPrice && (
                              <span>
                                Final Price:{" "}
                                <strong className="text-green-700">
                                  {formatCurrency(
                                    variety.offerPrice
                                  )}
                                </strong>
                              </span>
                            )}

                            {discount > 0 && (
                              <span className="font-bold text-green-700">
                                Customer saves{" "}
                                {formatCurrency(
                                  Number(variety.sellingPrice) -
                                    Number(variety.offerPrice)
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-xl border border-[#eadfda] bg-[#fcfaf8] px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        isActive: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-[#40134f]"
                  />

                  <span className="text-sm font-semibold text-[#4c4147]">
                    Product is active and visible to customers
                  </span>
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#eadfda] px-5 py-4 sm:flex-row sm:justify-end md:px-7">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-[#ded2cd] px-5 py-3 text-sm font-semibold text-[#655961] transition hover:bg-[#f7f4f1] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#40134f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#32103f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;