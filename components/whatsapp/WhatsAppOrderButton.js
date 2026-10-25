"use client";
import { toast } from "react-toastify";
import { orderOnWhatsApp } from "@/lib/whatsapp";

// items: [{ productId, productName, productImage, price, color, size, quantity }]
// validate: optional () => boolean, runs first (e.g. "please select a size")
export default function WhatsAppOrderButton({
  items,
  source,
  validate,
  disabled,
  label = "Order on WhatsApp",
  className = "",
}) {
  const handleClick = (e) => {
    e.preventDefault();
    if (validate && !validate()) return;
    if (!items?.length) {
      toast.error("Nothing to order yet");
      return;
    }
    if (!orderOnWhatsApp({ items, source })) {
      toast.error("WhatsApp ordering is not available right now. Please contact us.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`jvr-whatsapp-btn ${className}`}
    >
      <i className="fab fa-whatsapp" />
      <span>{label}</span>
    </button>
  );
}
