import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Reference to User model, for each user
    items: [
      {
        productId: { type: String, required: true }, // Reference to Product model
        productName: { type: String, required: true },
        productPrice: { type: Number, required: true },
        productImage: { type: String, required: true },
        productColor: { type: String, required: true },
        productStock : { type: Number, required: true },
        productSize: { type: String, required: true },
        quantity: { type: Number, required: true },
    variantId: { type: String, required: true },

        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;
