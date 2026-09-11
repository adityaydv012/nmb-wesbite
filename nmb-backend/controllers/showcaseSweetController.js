import mongoose from "mongoose";
import ShowcaseSweet from "../models/ShowcaseSweet.js";

/* =========================================================
   HELPERS
========================================================= */

const cleanImages = (images) => {
  if (!Array.isArray(images)) {
    return [];
  }

  return [
    ...new Set(
      images
        .map((image) =>
          String(image || "").trim()
        )
        .filter(Boolean)
    ),
  ];
};

const cleanDietary = (dietary) => {
  if (!Array.isArray(dietary)) {
    return [];
  }

  return [
    ...new Set(
      dietary
        .map((item) =>
          String(item || "").trim()
        )
        .filter(Boolean)
    ),
  ];
};

const getPayload = (body) => {
  return {
    name: String(body.name || "").trim(),

    description: String(
      body.description || ""
    ).trim(),

    category: String(
      body.category || ""
    ).trim(),

    images: cleanImages(body.images),

    badge: String(
      body.badge || ""
    ).trim(),

    dietary: cleanDietary(
      body.dietary
    ),

    displayOrder: Math.max(
      0,
      Number(body.displayOrder || 0)
    ),

    isActive:
      body.isActive !== false,
  };
};

/* =========================================================
   PUBLIC
   GET ALL ACTIVE SHOWCASE SWEETS
========================================================= */

export const getAllShowcaseSweets = async (
  req,
  res
) => {
  try {
    const sweets =
      await ShowcaseSweet.find({
        isActive: true,
      })
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      sweets,
    });
  } catch (error) {
    console.error(
      "Get showcase sweets error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch showcase sweets.",
    });
  }
};

/* =========================================================
   ADMIN
   GET ALL SHOWCASE SWEETS
========================================================= */

export const getAllAdminShowcaseSweets =
  async (req, res) => {
    try {
      const sweets =
        await ShowcaseSweet.find()
          .sort({
            displayOrder: 1,
            createdAt: -1,
          })
          .lean();

      return res.status(200).json({
        success: true,
        sweets,
      });
    } catch (error) {
      console.error(
        "Get admin showcase sweets error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch showcase sweets.",
      });
    }
  };

/* =========================================================
   ADMIN
   GET ONE SHOWCASE SWEET
========================================================= */

export const getShowcaseSweetById =
  async (req, res) => {
    try {
      const { sweetId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          sweetId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid showcase sweet ID.",
        });
      }

      const sweet =
        await ShowcaseSweet.findById(
          sweetId
        ).lean();

      if (!sweet) {
        return res.status(404).json({
          success: false,
          message:
            "Showcase sweet not found.",
        });
      }

      return res.status(200).json({
        success: true,
        sweet,
      });
    } catch (error) {
      console.error(
        "Get showcase sweet by ID error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch showcase sweet.",
      });
    }
  };

/* =========================================================
   ADMIN
   CREATE SHOWCASE SWEET
========================================================= */

export const createShowcaseSweet =
  async (req, res) => {
    try {
      const payload =
        getPayload(req.body);

      if (!payload.name) {
        return res.status(400).json({
          success: false,
          message:
            "Sweet name is required.",
        });
      }

      if (!payload.category) {
        return res.status(400).json({
          success: false,
          message:
            "Sweet category is required.",
        });
      }

      if (
        payload.images.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "At least one image is required.",
        });
      }

      const sweet =
        await ShowcaseSweet.create({
          ...payload,

          createdBy:
            req.admin?._id ||
            req.admin?.id ||
            undefined,
        });

      return res.status(201).json({
        success: true,
        message:
          "Showcase sweet created successfully.",
        sweet,
      });
    } catch (error) {
      console.error(
        "Create showcase sweet error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to create showcase sweet.",
      });
    }
  };

/* =========================================================
   ADMIN
   UPDATE SHOWCASE SWEET
========================================================= */

export const updateShowcaseSweet =
  async (req, res) => {
    try {
      const { sweetId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          sweetId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid showcase sweet ID.",
        });
      }

      const payload =
        getPayload(req.body);

      if (!payload.name) {
        return res.status(400).json({
          success: false,
          message:
            "Sweet name is required.",
        });
      }

      if (!payload.category) {
        return res.status(400).json({
          success: false,
          message:
            "Sweet category is required.",
        });
      }

      if (
        payload.images.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "At least one image is required.",
        });
      }

      const sweet =
        await ShowcaseSweet.findByIdAndUpdate(
          sweetId,
          payload,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!sweet) {
        return res.status(404).json({
          success: false,
          message:
            "Showcase sweet not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Showcase sweet updated successfully.",
        sweet,
      });
    } catch (error) {
      console.error(
        "Update showcase sweet error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update showcase sweet.",
      });
    }
  };

/* =========================================================
   ADMIN
   UPDATE STATUS
========================================================= */

export const updateShowcaseSweetStatus =
  async (req, res) => {
    try {
      const { sweetId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          sweetId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid showcase sweet ID.",
        });
      }

      const sweet =
        await ShowcaseSweet.findByIdAndUpdate(
          sweetId,
          {
            isActive:
              req.body.isActive !== false,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!sweet) {
        return res.status(404).json({
          success: false,
          message:
            "Showcase sweet not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Showcase sweet status updated successfully.",
        sweet,
      });
    } catch (error) {
      console.error(
        "Update showcase sweet status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update showcase sweet status.",
      });
    }
  };

/* =========================================================
   ADMIN
   DELETE
========================================================= */

export const deleteShowcaseSweet =
  async (req, res) => {
    try {
      const { sweetId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          sweetId
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid showcase sweet ID.",
        });
      }

      const sweet =
        await ShowcaseSweet.findByIdAndDelete(
          sweetId
        );

      if (!sweet) {
        return res.status(404).json({
          success: false,
          message:
            "Showcase sweet not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Showcase sweet deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Delete showcase sweet error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete showcase sweet.",
      });
    }
  };