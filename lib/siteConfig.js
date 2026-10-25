// Store-wide feature switches. Values come from .env.local (NEXT_PUBLIC_* so the client can read them).

// Razorpay checkout is kept in the codebase but disabled until this is set to "true".
// While disabled, orders are placed through WhatsApp and the team completes them manually.
export const CHECKOUT_ENABLED = process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === "true";

// Store WhatsApp number with country code, digits only (e.g. 919876543210).
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");

export const STORE_NAME = "SRI JVR TEXTILES";
