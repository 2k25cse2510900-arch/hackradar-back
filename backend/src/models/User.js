const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Kartik Kumar",
      trim: true,
    },

    college: {
      type: String,
      default: "",
      trim: true,
    },

    year: {
      type: String,
      default: "",
      trim: true,
    },

    degree: {
      type: String,
      default: "",
      trim: true,
    },

    domains: {
      type: [String],
      default: ["AI", "Web Development"],
    },

    skills: {
      type: [String],
      default: ["React", "Node.js", "Git", "GitHub"],
    },

    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    goals: {
      type: [String],
      default: ["Learning", "Build Portfolio"],
    },

    preferredMode: {
      type: String,
      default: "Online",
    },

    availability: {
      type: String,
      default: "Anytime",
    },
  },
  {
    _id: false,
  }
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      default: "",
    },

    lastName: {
      type: String,
      trim: true,
      default: "",
    },

    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },

    passwordHash: {
      type: String,
      select: false,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    authProvider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },

    telegramChatId: {
      type: String,
      default: null,
      index: true,
    },

    telegramVerified: {
      type: Boolean,
      default: false,
    },

    telegramVerificationCode: {
      type: String,
      default: "",
      select: false,
    },

    telegramVerificationExpires: {
      type: Date,
      default: null,
      select: false,
    },

    profile: {
      type: profileSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    collection: "Users",
  }
);

// Database Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ telegramChatId: 1 });

// Hide sensitive fields
userSchema.methods.toSafeObject = function () {
  const user = this.toObject();

  delete user.passwordHash;
  delete user.telegramVerificationCode;
  delete user.telegramVerificationExpires;

  return user;
};

module.exports = mongoose.model("User", userSchema);