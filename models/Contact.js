import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 320 },
    phone: { type: String, default: "", trim: true, maxlength: 80 },
    subject: { type: String, default: "", trim: true, maxlength: 300 },
    message: { type: String, required: true, trim: true, maxlength: 10000 },
    status: {
      type: String,
      enum: ["new", "read", "replied"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
