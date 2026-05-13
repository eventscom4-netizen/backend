import Blog from "../models/Blog.js";

export async function getBlogs(req, res) {
  const blogs = await Blog.find({}).sort({ createdAt: -1 });
  res.json(blogs);
}

export async function getBlogBySlug(req, res) {
  const { slug } = req.params;
  const blog = await Blog.findOne({ slug });
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json(blog);
}

export async function createBlog(req, res) {
  const { 
    title_en, title_ar, content_en, content_ar, image,
    metaDescription_en, metaDescription_ar, metaKeywords_en, metaKeywords_ar
  } = req.body || {};
  
  if (!title_en || !title_ar || !content_en || !content_ar) {
    return res.status(400).json({ message: "Missing required blog fields" });
  }

  const blog = await Blog.create({
    title_en,
    title_ar,
    content_en,
    content_ar,
    image: image || "",
    metaDescription_en: metaDescription_en || "",
    metaDescription_ar: metaDescription_ar || "",
    metaKeywords_en: metaKeywords_en || "",
    metaKeywords_ar: metaKeywords_ar || "",
  });

  res.status(201).json(blog);
}

export async function updateBlog(req, res) {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  const { 
    title_en, title_ar, content_en, content_ar, image,
    metaDescription_en, metaDescription_ar, metaKeywords_en, metaKeywords_ar
  } = req.body || {};

  if (typeof title_en !== "undefined") blog.title_en = title_en;
  if (typeof title_ar !== "undefined") blog.title_ar = title_ar;
  if (typeof content_en !== "undefined") blog.content_en = content_en;
  if (typeof content_ar !== "undefined") blog.content_ar = content_ar;
  if (typeof image !== "undefined") blog.image = image;
  if (typeof metaDescription_en !== "undefined") blog.metaDescription_en = metaDescription_en;
  if (typeof metaDescription_ar !== "undefined") blog.metaDescription_ar = metaDescription_ar;
  if (typeof metaKeywords_en !== "undefined") blog.metaKeywords_en = metaKeywords_en;
  if (typeof metaKeywords_ar !== "undefined") blog.metaKeywords_ar = metaKeywords_ar;

  const updated = await blog.save();
  res.json(updated);
}

export async function deleteBlog(req, res) {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  await blog.deleteOne();
  res.json({ message: "Blog deleted" });
}

