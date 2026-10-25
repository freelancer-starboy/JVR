import { auth } from "@/lib/firebase/firebase";
import { STORE_NAME, WHATSAPP_NUMBER } from "@/lib/siteConfig";

const VISITOR_KEY = "jvr_visitor_id";

function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

// Maps cart documents (cartSchema items) to WhatsApp order items.
export const cartItemsToOrderItems = (cartItems = []) =>
  cartItems.map((item) => ({
    productId: String(item.productId),
    productName: item.productName,
    productImage: item.productImage,
    price: item.productPrice,
    color: item.productColor,
    size: item.productSize,
    quantity: item.quantity,
  }));

const formatPrice =(value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

// items: [{ productId, productName, productImage, price, color, size, quantity }]
export function buildWhatsAppMessage(items, customerName) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const lines = [
    `Hi ${STORE_NAME}! I'd like to order${customerName ? ` (${customerName})` : ""}:`,
    "",
  ];
  let total = 0;
  items.forEach((item, index) => {
    const qty = item.quantity || 1;
    total += (item.price || 0) * qty;
    const details = [item.color && `Colour: ${item.color}`, item.size && `Size: ${item.size}`, `Qty: ${qty}`]
      .filter(Boolean)
      .join(" | ");
    lines.push(`${index + 1}. ${item.productName}`);
    lines.push(`   ${details} | ${formatPrice(item.price)} each`);
    if (item.productId) lines.push(`   ${origin}/ShopDetails/${item.productId}`);
  });
  lines.push("", `Total: ${formatPrice(total)}`, "", "Please share the next steps. Thank you!");
  return lines.join("\n");
}

async function recordEnquiry(payload) {
  const headers = { "Content-Type": "application/json" };
  try {
    const token = await auth.currentUser?.getIdToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  } catch {
    // Not signed in or token refresh failed: record as a guest.
  }
  return fetch("/api/whatsapp/enquiry", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch((error) => console.error("Failed to record WhatsApp enquiry", error));
}

// Opens the WhatsApp chat with a pre-filled order message and records the click.
// Must be called directly from a click handler so the popup isn't blocked.
export function orderOnWhatsApp({ items, source }) {
  if (!WHATSAPP_NUMBER) {
    console.error("NEXT_PUBLIC_WHATSAPP_NUMBER is not set");
    return false;
  }
  if (!items?.length) return false;

  const customerName = auth.currentUser?.displayName || "";
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    buildWhatsAppMessage(items, customerName)
  )}`;
  // window.open returns null when called with "noopener", so detach the opener manually.
  const opened = window.open(url, "_blank");
  if (opened) opened.opener = null;
  else window.location.href = url;

  recordEnquiry({ source, items, pageUrl: window.location.href, visitorId: getVisitorId() });
  return true;
}
