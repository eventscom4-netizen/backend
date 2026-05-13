import Contact from "../models/Contact.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(req, res) {
  const { name, email, phone, subject, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required" });
  }
  if (!EMAIL_RE.test(String(email).trim())) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  const doc = await Contact.create({
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    phone: phone != null ? String(phone).trim() : "",
    subject: subject != null ? String(subject).trim() : "",
    message: String(message).trim(),
  });

  res.status(201).json({ id: doc._id, message: "Thank you — we received your message." });
}

export async function listContacts(req, res) {
  const { status } = req.query;
  const filter = {};
  if (status && status !== "all" && ["new", "read", "replied"].includes(status)) {
    filter.status = status;
  }
  const contacts = await Contact.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ contacts });
}

export async function updateContactStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!["new", "read", "replied"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  const doc = await Contact.findByIdAndUpdate(id, { status }, { new: true });
  if (!doc) return res.status(404).json({ message: "Enquiry not found" });
  res.json(doc);
}

export async function deleteContact(req, res) {
  const { id } = req.params;
  const doc = await Contact.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ message: "Enquiry not found" });
  res.json({ message: "Deleted" });
}
