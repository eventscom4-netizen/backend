import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    title_en: { type: String, required: true, trim: true },
    title_ar: { type: String, required: true, trim: true },
    content_en: { type: String, required: true },
    content_ar: { type: String, required: true },
    image: { type: String, default: "" },
    slug: { type: String, unique: true, index: true },
  },
  { timestamps: true }
);

async function generateUniqueSlug(doc) {
  const baseTitle = (doc.title_en || doc.title_ar || "").trim();
  const base = slugify(baseTitle, { lower: true, strict: true }) || "post";
  let candidate = base;
  let i = 1;

  const Blog = mongoose.model("Blog");
  // Ensure uniqueness even for same titles
  while (await Blog.exists({ slug: candidate, _id: { $ne: doc._id } })) {
    candidate = `${base}-${i++}`;
  }
  return candidate;
}

blogSchema.pre("validate", async function preValidate(next) {
  if (!this.slug || this.isModified("title_en") || this.isModified("title_ar")) {
    this.slug = await generateUniqueSlug(this);
  }
  next();
});

export default mongoose.model("Blog", blogSchema);

