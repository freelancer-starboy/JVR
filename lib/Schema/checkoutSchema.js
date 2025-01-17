import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema({
  userId: {
    type: String, // Ensure to specify type
    required: true,
  },
  cartItems: [
    {
      productId: {
        type: String,
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      color: {
        name: { type: String },
      },
      size: {
        name: { type: String },
      },
    },
  ],
  shippingAddress: {
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  paymentDetails: {
    method: {
      type: String,
      required: true, // Ensure this field is required
    },
    transactionId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'Pending',
    },
  },
  orderTotal: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    default: 'Processing',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Checkout = mongoose.models.Checkout || mongoose.model('Checkout', checkoutSchema);

export default Checkout;
