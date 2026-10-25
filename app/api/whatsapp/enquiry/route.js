import connectDb from "@/lib/database/db";
import WhatsappEnquiry from "@/lib/Schema/whatsappEnquirySchema";
import { getRequestUser, json } from "@/lib/auth/verifyRequest";

export const dynamic = "force-dynamic";

const SOURCES = ["cart", "product", "wishlist"];
const MAX_ITEMS = 50;

const str = (value, max = 300) =>
  typeof value === "string" ? value.slice(0, max) : value == null ? undefined : String(value).slice(0, max);

const num = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

// POST /api/whatsapp/enquiry
// body: { source, items: [{ productId, productName, productImage, price, color, size, quantity }], pageUrl, visitorId }
// Logs a WhatsApp order click. Signed-in users are identified by their Firebase token,
// everyone else by an anonymous visitorId kept in their browser.
export async function POST(req) {
  try {
    const body = await req.json();
    const user = await getRequestUser(req);

    const source = SOURCES.includes(body?.source) ? body.source : null;
    if (!source) return json({ message: "Invalid source" }, 400);

    const items = (Array.isArray(body?.items) ? body.items : [])
      .slice(0, MAX_ITEMS)
      .map((item) => ({
        productId: str(item.productId, 64),
        productName: str(item.productName),
        productImage: str(item.productImage, 1000),
        price: num(item.price),
        color: str(item.color, 50),
        size: str(item.size, 50),
        quantity: Math.max(1, Math.floor(num(item.quantity) || 1)),
      }))
      .filter((item) => item.productId && item.productName);
    if (items.length === 0) return json({ message: "No products to record" }, 400);

    const visitorId = str(body?.visitorId, 64);
    if (!user && !visitorId) return json({ message: "Missing visitor" }, 400);

    const userKey = user ? user.uid : `guest:${visitorId}`;
    const totalAmount = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    const now = new Date();

    const profile = user
      ? {
          userId: user.uid,
          isGuest: false,
          ...(user.name && { name: user.name }),
          ...(user.email && { email: user.email }),
          ...(user.phone_number && { phone: user.phone_number }),
        }
      : { userId: null, isGuest: true };

    await connectDb();
    await WhatsappEnquiry.updateOne(
      { userKey },
      {
        $set: { ...profile, lastEnquiryAt: now },
        $push: {
          enquiries: { source, items, totalAmount, pageUrl: str(body?.pageUrl, 500), createdAt: now },
        },
        $inc: { totalEnquiries: 1 },
      },
      { upsert: true }
    );

    return json({ message: "Recorded" });
  } catch (error) {
    console.error("WhatsApp enquiry error:", error);
    return json({ message: "Failed to record enquiry" }, 500);
  }
}
