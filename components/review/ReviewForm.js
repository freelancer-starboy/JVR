"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuth } from "@/components/AuthContent/AuthContent";
import { useAddReviewMutation, useGetMyReviewQuery } from "@/features/api/reviewApi";

const MAX_IMAGES = 4;
const MAX_COMMENT = 2000;
const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

// "Write a review" box on the product page. Signed-in customers can post one review
// per product (posting again updates it). Blocked customers see a notice instead.
export default function ReviewForm({ productId }) {
  const { userId, isAuthLoading } = useAuth();
  const { data, isLoading } = useGetMyReviewQuery({ userId, productId }, { skip: !userId || !productId });
  const [addReview, { isLoading: isSaving }] = useAddReviewMutation();

  const existing = data?.review;
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState([]);

  // Pre-fill when editing an existing review
  useEffect(() => {
    if (existing) {
      setRating(existing.rating);
      setComment(existing.comment);
    }
  }, [existing]);

  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  if (isAuthLoading || (userId && isLoading)) return null;

  if (!userId) {
    return (
      <div className="jvr-review-cta">
        <p>Bought or tried this product? Share your thoughts with other shoppers.</p>
        <Link href="/sign-in" className="tpcart-btn d-inline-block">
          Sign in to write a review
        </Link>
      </div>
    );
  }

  if (data?.blocked) {
    return (
      <div className="jvr-review-cta is-blocked">
        <i className="fal fa-ban" />
        <p>Reviews are turned off for your account. Please contact us if you think this is a mistake.</p>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="jvr-review-cta">
        <p>{existing ? "You've reviewed this product." : "Share your thoughts with other shoppers."}</p>
        <button type="button" className="tpcheck-btn d-inline-block" onClick={() => setOpen(true)}>
          {existing ? "Edit your review" : "Write a review"}
        </button>
      </div>
    );
  }

  const onFiles = (e) => {
    const picked = Array.from(e.target.files || []).filter((file) => file.type.startsWith("image/"));
    e.target.value = "";
    if (picked.some((file) => file.size > 5 * 1024 * 1024)) {
      toast.error("Each photo must be under 5 MB");
      return;
    }
    setFiles((current) => [...current, ...picked].slice(0, MAX_IMAGES));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error("Please choose a star rating");
    if (!comment.trim()) return toast.error("Please write a few words about the product");

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("rating", rating);
    formData.append("comment", comment.trim());
    files.forEach((file) => formData.append("images", file));

    try {
      const res = await addReview(formData).unwrap();
      toast.success(res?.message || "Review posted");
      setFiles([]);
      setOpen(false);
    } catch (error) {
      toast.error(error?.data?.message || "Couldn't save your review. Please try again.");
    }
  };

  return (
    <form className="jvr-review-form" onSubmit={submit}>
      <h5>{existing ? "Edit your review" : "Write a review"}</h5>

      <div className="jvr-review-form__stars" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={(hover || rating) >= star ? "is-on" : ""}
            onMouseEnter={() => setHover(star)}
            onClick={() => setRating(star)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            <i className="fas fa-star" />
          </button>
        ))}
        <span>{LABELS[hover || rating]}</span>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))}
        placeholder="How was the fit, fabric and colour?"
        rows={4}
      />
      <div className="jvr-review-form__count">
        {comment.length}/{MAX_COMMENT}
      </div>

      <div className="jvr-review-form__photos">
        {previews.map((src, index) => (
          <div key={src} className="jvr-review-form__thumb">
            <img src={src} alt="" />
            <button
              type="button"
              aria-label="Remove photo"
              onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}
            >
              <i className="fal fa-times" />
            </button>
          </div>
        ))}
        {files.length < MAX_IMAGES && (
          <label className="jvr-review-form__add">
            <i className="fal fa-camera" />
            <span>Add photo</span>
            <input type="file" accept="image/*" multiple hidden onChange={onFiles} />
          </label>
        )}
      </div>
      {existing?.imageUrls?.length > 0 && files.length === 0 && (
        <p className="jvr-review-form__hint">Your current photos stay unless you add new ones.</p>
      )}

      <div className="jvr-review-form__actions">
        <button type="button" className="tpcart-btn" onClick={() => setOpen(false)} disabled={isSaving}>
          Cancel
        </button>
        <button type="submit" className="tpcheck-btn" disabled={isSaving}>
          {isSaving ? "Saving…" : existing ? "Update review" : "Post review"}
        </button>
      </div>
    </form>
  );
}
