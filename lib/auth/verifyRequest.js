import { verifyIdToken } from "@/lib/firebase/firebaseAdmin";

// Reads the Firebase ID token from the `Authorization: Bearer <token>` header.
// Returns the decoded token ({ uid, name, email, phone_number, ... }) or null.
export async function getRequestUser(req) {
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;
  if (!token) return null;
  try {
    return await verifyIdToken(token);
  } catch {
    return null;
  }
}

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
