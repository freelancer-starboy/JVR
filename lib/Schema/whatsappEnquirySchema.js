import mongoose from "mongoose";

// Records every "Order on WhatsApp" click so the team can follow up.
// One document per user (or anonymous visitor); each click is pushed into `enquiries`
// with its date and the products the customer was looking at.
// The admin dashboard (JVR-ADMIN) reads and updates this same collection.

const itemSchema = new mongoose.Schema(
  {
    productId: String,
    productName: String,
    productImage: String,
    price: Number,
    color: String,
    size: String,
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

const enquirySchema = new mongoose.Schema({
  source: { type: String, enum: ["cart", "product", "wishlist"], required: true },
  items: [itemSchema],
  totalAmount: Number,
  pageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

const whatsappEnquirySchema = new mongoose.Schema(
  {
    userKey: { type: String, required: true, unique: true }, // firebase uid, or "guest:<visitorId>"
    userId: { type: String, default: null }, // firebase uid when logged in
    isGuest: { type: Boolean, default: false },
    name: String,
    email: String,
    phone: String,
    enquiries: [enquirySchema],
    totalEnquiries: { type: Number, default: 0 },
    lastEnquiryAt: Date,
    followUpStatus: {
      type: String,
      enum: ["new", "contacted", "converted", "not_interested"],
      default: "new",
    },
    followUpNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

const WhatsappEnquiry =
  mongoose.models.WhatsappEnquiry ||
  mongoose.model("WhatsappEnquiry", whatsappEnquirySchema, "whatsapp_enquiries");

export default WhatsappEnquiry;
