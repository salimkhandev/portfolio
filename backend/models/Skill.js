const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [100, "Name cannot exceed 100 characters"]
  },
  order: {
    type: Number,
    default: 0
  },
  iconKey: {
    type: String,
    trim: true,
    default: ''
  },
  iconColor: {
    type: String,
    trim: true,
    default: ''
  },
  imageUrl: {
    type: String,
    trim: true,
    default: ''
  },
  cloudinaryImagePublicId: {
    type: String,
    trim: true
  },
  topics: {
    type: [String],
    default: [],
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: "At least one topic is required"
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
skillSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Skill", skillSchema);
