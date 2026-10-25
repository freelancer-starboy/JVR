"use client";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import useWishlist from "@/components/wishlist/useWishlist";
import WhatsAppOrderButton from "@/components/whatsapp/WhatsAppOrderButton";
import { useAuth } from "@/components/AuthContent/AuthContent";

const toOrderItem = (item) => ({
  productId: item.productId,
  productName: item.productName,
  productImage: item.productImage,
  price: item.productPrice,
  quantity: 1,
});

function WishlistSkeleton() {
  return (
    <div className="jvr-wishlist-grid">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="jvr-wishlist-card">
          <div className="jvr-skeleton jvr-skeleton--img" />
          <div className="jvr-wishlist-card__body">
            <div className="jvr-skeleton jvr-skeleton--line" />
            <div className="jvr-skeleton jvr-skeleton--line short" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Wishlist() {
  const { isAuthLoading } = useAuth();
  const { userId, items, isLoading, remove } = useWishlist();

  let content;
  if (isAuthLoading || isLoading) {
    content = <WishlistSkeleton />;
  } else if (!userId) {
    content = (
      <div className="jvr-empty-state">
        <i className="fal fa-heart" />
        <h3>Save your favourites</h3>
        <p>Sign in to add products to your wishlist and find them here anytime.</p>
        <Link href="/sign-in" className="tpcheck-btn d-inline-block">
          Sign In
        </Link>
      </div>
    );
  } else if (items.length === 0) {
    content = (
      <div className="jvr-empty-state">
        <i className="fal fa-heart" />
        <h3>Your wishlist is empty</h3>
        <p>Tap the heart on any product to save it for later.</p>
        <Link href="/shop-2" className="tpcheck-btn d-inline-block">
          Explore Products
        </Link>
      </div>
    );
  } else {
    content = (
      <>
        <div className="jvr-wishlist-toolbar">
          <p>
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
          <WhatsAppOrderButton
            source="wishlist"
            items={items.map(toOrderItem)}
            label="Enquire about all on WhatsApp"
          />
        </div>
        <div className="jvr-wishlist-grid">
          {items.map((item) => {
            const discount =
              item.productOldPrice > item.productPrice
                ? Math.round(((item.productOldPrice - item.productPrice) / item.productOldPrice) * 100)
                : 0;
            return (
              <div key={item.productId} className="jvr-wishlist-card">
                <Link href={`/ShopDetails/${item.productId}`} className="jvr-wishlist-card__media">
                  <img src={item.productImage || "/assets/img/no-image.svg"} alt={item.productName} loading="lazy" />
                  {discount > 0 && <span className="jvr-badge">{discount}% OFF</span>}
                </Link>
                <button
                  type="button"
                  className="jvr-wish-btn jvr-wish-btn--floating is-active"
                  onClick={() => remove(item.productId)}
                  aria-label={`Remove ${item.productName} from wishlist`}
                  title="Remove from wishlist"
                >
                  <i className="fas fa-heart" />
                </button>
                <div className="jvr-wishlist-card__body">
                  <Link href={`/ShopDetails/${item.productId}`} className="jvr-wishlist-card__title">
                    {item.productName}
                  </Link>
                  <div className="jvr-price">
                    <span>₹{item.productPrice}</span>
                    {item.productOldPrice > item.productPrice && <del>₹{item.productOldPrice}</del>}
                  </div>
                  <div className="jvr-wishlist-card__actions">
                    <Link href={`/ShopDetails/${item.productId}`} className="tpcart-btn">
                      Select Size
                    </Link>
                    <WhatsAppOrderButton
                      source="wishlist"
                      items={[toOrderItem(item)]}
                      label="Enquire"
                      className="jvr-whatsapp-btn--compact"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <Layout headerStyle={3} footerStyle={2} breadcrumbTitle="Wishlist">
      <section className="pt-60 pb-80">
        <div className="container">{content}</div>
      </section>
    </Layout>
  );
}
