const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    hackathonId: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    channels: {
      type: [String],
      enum: ["email", "telegram"],
      default: ["email"],
    },

    reminderType: {
      type: String,
      enum: ["7d", "3d", "1d", "1h"],
      required: true,
      index: true,
    },

    frequency: {
      type: String,
      default: "once",
    },

    enabled: {
      type: Boolean,
      default: true,
      index: true,
    },

    alertTime: {
      type: Date,
      required: true,
      index: true,
    },

    lastTriggeredAt: {
      type: Date,
      default: null,
    },

    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: "Alerts",
  }
);

// Fast lookup for cron
alertSchema.index({
  enabled: 1,
  alertTime: 1,
});

module.exports = mongoose.model("Alert", alertSchema);