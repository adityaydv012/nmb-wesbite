import mongoose from "mongoose";

const settingsSchema =
  new mongoose.Schema(
    {
      key: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      gstEnabled: {
        type: Boolean,
        default: true,
      },

      gstRate: {
        type: Number,
        default: 5,
        min: 0,
        max: 100,
      },
    },
    {
      timestamps: true,
    }
  );

const Settings =
  mongoose.models.Settings ||
  mongoose.model(
    "Settings",
    settingsSchema
  );

export default Settings;