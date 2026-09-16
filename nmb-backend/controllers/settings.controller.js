import Settings from "../models/Settings.js";

/* =========================================================
   GET GST SETTINGS - ADMIN
========================================================= */

export const getGstSettings = async (
  req,
  res
) => {
  try {
    let settings = await Settings.findOne({
      key: "checkout",
    });

    if (!settings) {
      settings = await Settings.create({
        key: "checkout",
        gstEnabled: true,
        gstRate: 5,
      });
    }

    return res.status(200).json({
      success: true,
      settings: {
        gstEnabled: settings.gstEnabled,
        gstRate: settings.gstRate,
      },
    });
  } catch (error) {
    console.error(
      "Get GST settings error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load GST settings.",
    });
  }
};

/* =========================================================
   UPDATE GST SETTINGS - ADMIN
========================================================= */

export const updateGstSettings = async (
  req,
  res
) => {
  try {
    const {
      gstEnabled,
      gstRate,
    } = req.body;

    const enabled =
      gstEnabled !== false;

    const rate = Number(
      gstRate ?? 5
    );

    if (
      !Number.isFinite(rate) ||
      rate < 0 ||
      rate > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "GST rate must be between 0 and 100.",
      });
    }

    const settings =
      await Settings.findOneAndUpdate(
        {
          key: "checkout",
        },
        {
          key: "checkout",
          gstEnabled: enabled,
          gstRate: rate,
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

    return res.status(200).json({
      success: true,
      message:
        "GST settings updated successfully.",
      settings: {
        gstEnabled:
          settings.gstEnabled,
        gstRate:
          settings.gstRate,
      },
    });
  } catch (error) {
    console.error(
      "Update GST settings error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update GST settings.",
    });
  }
};

/* =========================================================
   GET GST SETTINGS - PUBLIC
========================================================= */

export const getPublicGstSettings =
  async (req, res) => {
    try {
      let settings =
        await Settings.findOne({
          key: "checkout",
        });

      /*
       * Create default settings if they
       * don't exist yet.
       */
      if (!settings) {
        settings =
          await Settings.create({
            key: "checkout",
            gstEnabled: true,
            gstRate: 5,
          });
      }

      return res.status(200).json({
        success: true,
        settings: {
          gstEnabled:
            settings.gstEnabled,
          gstRate:
            settings.gstRate,
        },
      });
    } catch (error) {
      console.error(
        "Get public GST settings error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load GST settings.",
      });
    }
  };