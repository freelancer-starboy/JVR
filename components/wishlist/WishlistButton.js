"use client";
import useWishlist from "./useWishlist";

// Heart toggle. `variant="floating"` sits on top of a product image,
// `variant="inline"` matches the product-details action buttons.
export default function WishlistButton({ product, variant = "floating", className = "" }) {
  const { isWishlisted, toggle } = useWishlist();
  if (!product?._id) return null;
  const active = isWishlisted(product._id);

  const handleClick = (e) => {
    // Cards are wrapped in links; don't navigate when toggling.
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`jvr-wish-btn jvr-wish-btn--${variant} ${active ? "is-active" : ""} ${className}`}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <i className={`${active ? "fas" : "fal"} fa-heart`} />
    </button>
  );
}
