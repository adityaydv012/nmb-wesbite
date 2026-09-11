import mongoose from "mongoose";
import Product from "../models/Product.js";

const cleanImages = (images, image) => {
  const imageArray = Array.isArray(images) ? images : [];

  const finalImages = imageArray
    .map((item) => String(item || "").trim())
    .filter(Boolean);

  if (finalImages.length === 0 && image) {
    finalImages.push(String(image).trim());
  }

  return [...new Set(finalImages)];
};

const cleanVarieties = (varieties) => {
  if (!Array.isArray(varieties)) {
    return [];
  }

  return varieties
    .map((variety) => {
      const sellingPrice = Number(
        variety.sellingPrice ?? variety.price
      );

      const rawOfferPrice =
        variety.offerPrice === "" ||
        variety.offerPrice === null ||
        variety.offerPrice === undefined
          ? null
          : Number(variety.offerPrice);

      const offerPrice =
        rawOfferPrice !== null &&
        Number.isFinite(rawOfferPrice) &&
        rawOfferPrice > 0 &&
        rawOfferPrice < sellingPrice
          ? rawOfferPrice
          : null;

      return {
        weight: String(variety.weight || "").trim(),
        sellingPrice,
        offerPrice,
        stock: Math.max(0, Number(variety.stock || 0)),
        isAvailable: variety.isAvailable !== false,
      };
    })
    .filter(
      (variety) =>
        variety.weight &&
        Number.isFinite(variety.sellingPrice) &&
        variety.sellingPrice >= 0
    );
};

const getProductPayload = (body) => {
  const images = cleanImages(body.images, body.image);

  return {
    name: String(body.name || "").trim(),
    description: String(body.description || "").trim(),
    category: String(body.category || "").trim(),
    image: images[0] || "",
    images,
    varieties: cleanVarieties(body.varieties),
    isActive: body.isActive !== false,
  };
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .lean();

    const formattedProducts = products.map((product) => ({
      ...product,

      varieties: (product.varieties || []).map((variety) => ({
        ...variety,

        // Backward compatibility for old frontend code
        price: variety.sellingPrice,

        discountPercentage:
          variety.offerPrice &&
          variety.offerPrice < variety.sellingPrice
            ? Math.round(
                ((variety.sellingPrice - variety.offerPrice) /
                  variety.sellingPrice) *
                  100
              )
            : 0,
      })),
    }));

    return res.status(200).json({
      success: true,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Get all products error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch products.",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch product.",
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const payload = getProductPayload(req.body);

    if (!payload.name) {
      return res.status(400).json({
        success: false,
        message: "Product name is required.",
      });
    }

    if (!payload.category) {
      return res.status(400).json({
        success: false,
        message: "Product category is required.",
      });
    }

    if (payload.varieties.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one valid variety is required.",
      });
    }

    const product = await Product.create({
      ...payload,
      createdBy:
        req.admin?._id ||
        req.admin?.id ||
        undefined,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create product.",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const payload = getProductPayload(req.body);

    if (!payload.name) {
      return res.status(400).json({
        success: false,
        message: "Product name is required.",
      });
    }

    if (!payload.category) {
      return res.status(400).json({
        success: false,
        message: "Product category is required.",
      });
    }

    if (payload.varieties.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one valid variety is required.",
      });
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update product.",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete product.",
    });
  }
};

export const updateProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      {
        isActive: req.body.isActive !== false,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product status updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Update product status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update product status.",
    });
  }
};