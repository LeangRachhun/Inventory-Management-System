import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Supplier name is required"],
    trim: true,
    minlength: [2, "Supplier name must be at least 2 characters"],
  },
  email: {
    type: String,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Supplier", supplierSchema);
