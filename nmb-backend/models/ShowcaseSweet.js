import mongoose from "mongoose";

const showcaseSweetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    images: {
      type: [String],
      default: [],
    },

    badge: {
      type: String,
      default: "",
      trim: true,
    },

    dietary: {
      type: [String],
      default: [],
    },

    displayOrder: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const ShowcaseSweet =
  mongoose.models.ShowcaseSweet ||
  mongoose.model(
    "ShowcaseSweet",
    showcaseSweetSchema
  );

export default ShowcaseSweet;