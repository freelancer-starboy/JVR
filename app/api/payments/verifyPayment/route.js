import Razorpay from "razorpay";
import crypto from "crypto";
import connectDb from "@/lib/database/db";
import Checkout from "@/lib/Schema/checkoutSchema";
import Product from "@/lib/Schema/productSchema";

function validateSignature(orderId, paymentId, razorPay_sign) {
  const text = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET)
    .update(text)
    .digest("hex");

  console.log("Expected Signature:", expectedSignature);
  console.log("Received Signature:", razorPay_sign);

  return expectedSignature === razorPay_sign;
}

async function updateProductStock(cartItems) {
  let updatedProducts = [];
  
  console.log("=== STARTING STOCK UPDATE ===");
  console.log("Cart items received:", JSON.stringify(cartItems, null, 2));
  
  for (const item of cartItems) {
    const { variantId, size, quantity, productId } = item;

    console.log(`\n--- Processing item ---`);
    console.log(`VariantId: ${variantId}, Size: ${size}, Quantity: ${quantity}`);

    if (!variantId || !size) {
      console.error(`Missing data - variantId: ${variantId}, size: ${size}`);
      throw new Error(`Missing variantId or size for item`);
    }
    
    // Find the product that contains the variant
    console.log(`Searching for product with variant: ${variantId}`);
    const productData = await Product.findOne({ "productVariants._id": variantId });

    if (!productData) {
      console.error(`Product not found for variant: ${variantId}`);
      throw new Error(`Product with variant ${variantId} not found`);
    }

    console.log(`Found product: ${productData.productName} (ID: ${productData._id})`);
    console.log(`Product has ${productData.productVariants.length} variants`);

    // Find the specific variant within the product
    const variant = productData.productVariants.find(v => v._id.toString() === variantId);

    if (!variant) {
      console.error(`Variant not found in product. Available variants:`, 
        productData.productVariants.map(v => v._id.toString()));
      throw new Error(`Variant ${variantId} not found`);
    }

    console.log(`Found variant: ${variant.color}, with ${variant.sizes.length} sizes`);
    console.log(`Available sizes:`, variant.sizes.map(s => `${s.size} (stock: ${s.stock})`));

    // Find the selected size within the variant
    const sizeItem = variant.sizes.find(s => s.size.trim() === size.trim());

    if (!sizeItem) {
      console.error(`Size not found. Looking for: "${size}", Available:`, 
        variant.sizes.map(s => `"${s.size}"`));
      throw new Error(`Size ${size} not found for variant ${variantId}`);
    }

    console.log(`Found size: ${sizeItem.size}, Current stock: ${sizeItem.stock}`);

    // Check if there's enough stock
    if (sizeItem.stock < quantity) {
      console.error(`Insufficient stock. Required: ${quantity}, Available: ${sizeItem.stock}`);
      throw new Error(`Insufficient stock for ${productData.productName} - ${variant.color} - Size ${size}. Available: ${sizeItem.stock}, Requested: ${quantity}`);
    }

    console.log(`Updating stock: ${sizeItem.stock} - ${quantity} = ${sizeItem.stock - quantity}`);

    // Update the stock for the size within the selected variant
    const updatedProduct = await Product.findOneAndUpdate(
      { "productVariants._id": variantId, "productVariants.sizes.size": size },
      { $inc: { "productVariants.$.sizes.$[elem].stock": -quantity } },
      { 
        new: true, 
        arrayFilters: [{ "elem.size": size }] 
      }
    );

    if (!updatedProduct) {
      console.error(`Update operation returned null`);
      throw new Error(`Failed to update stock for variant ${variantId}`);
    }

    // Verify the update
    const updatedVariant = updatedProduct.productVariants.find(v => v._id.toString() === variantId);
    const updatedSizeItem = updatedVariant.sizes.find(s => s.size.trim() === size.trim());
    console.log(`✅ Stock updated successfully! New stock: ${updatedSizeItem.stock}`);

    updatedProducts.push({
      productId: updatedProduct._id,
      productName: updatedProduct.productName,
      variantId: variantId,
      size: size,
      previousStock: sizeItem.stock,
      updatedStock: updatedSizeItem.stock,
      quantityDeducted: quantity
    });
  }
  
  console.log("=== STOCK UPDATE COMPLETE ===");
  console.log(`Updated ${updatedProducts.length} products`);
  
  return updatedProducts;
}

async function createOrder(orderData) {
  const { userId, cartItems, shippingAddress, paymentDetails, orderTotal, orderStatus } = orderData;

  // Validate cart items structure
  for (const item of cartItems) {
    if (!item.productId || !item.productName || !item.quantity || !item.price || !item.color || !item.size) {
      throw new Error(`Invalid cart item structure: missing required fields`);
    }
  }

  // Validate shipping address
  if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine1 || 
      !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode || !shippingAddress.country) {
    throw new Error("Invalid shipping address: missing required fields");
  }

  // Validate payment details
  if (!paymentDetails.method || !paymentDetails.transactionId || !paymentDetails.status) {
    throw new Error("Invalid payment details: missing required fields");
  }

  // Create and save the checkout document
  const newCheckout = new Checkout({
    userId,
    cartItems,
    shippingAddress,
    paymentDetails,
    orderTotal,
    orderStatus: orderStatus || 'Processing',
  });

  const savedCheckout = await newCheckout.save();
  return savedCheckout;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      userId,
      cartItems,
      shippingAddress,
      orderTotal
    } = body;

    console.log("Received data:", { userId, cartItems, shippingAddress, orderTotal });

    // Validate required payment fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return new Response(
        JSON.stringify({ error: "Missing required payment verification parameters" }),
        { status: 400 }
      );
    }

    // Validate required order fields
    if (!userId || !cartItems?.length || !shippingAddress || !orderTotal) {
      return new Response(
        JSON.stringify({ error: "Missing required order information" }),
        { status: 400 }
      );
    }

    // Ensure environment variables are set
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET) {
      console.error("Missing Razorpay environment variables");
      return new Response(
        JSON.stringify({ error: "Payment service is unavailable" }),
        { status: 500 }
      );
    }

    // Connect to database
    await connectDb();

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET,
    });

    // Fetch payment details from Razorpay
    let paymentDetails;
    try {
      paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
      console.log("Fetched Payment Details:", paymentDetails);
    } catch (error) {
      console.error("Error fetching payment details:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch payment details" }),
        { status: 500 }
      );
    }

    // Verify Payment Signature
    const isValidSignature = validateSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValidSignature) {
      console.error("Invalid payment signature");
      return new Response(
        JSON.stringify({ error: "Invalid payment signature" }),
        { status: 400 }
      );
    }

    // Capture the Payment (if needed)
    if (paymentDetails.status === "authorized") {
      try {
        await razorpay.payments.capture(razorpay_payment_id, paymentDetails.amount);
        console.log("Payment captured successfully");
        paymentDetails.status = "captured";
      } catch (error) {
        console.error("Error capturing payment:", error);
        return new Response(
          JSON.stringify({ error: "Failed to capture payment" }),
          { status: 500 }
        );
      }
    }

    // Check if payment is successful
    if (paymentDetails.status !== "captured") {
      return new Response(
        JSON.stringify({ error: "Payment not successful", status: paymentDetails.status }),
        { status: 400 }
      );
    }

    // Update product stock
    let updatedProducts;
    try {
      console.log("\n=== ATTEMPTING STOCK UPDATE ===");
      console.log("Cart items for stock update:", JSON.stringify(cartItems, null, 2));
      
      updatedProducts = await updateProductStock(cartItems);
      console.log("Stock updated successfully:", updatedProducts);
    } catch (error) {
      console.error("Error updating stock:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }

    // Create order in database
    let savedOrder;
    try {
      const orderData = {
        userId,
        cartItems: cartItems.map(item => ({
          productImage: item.productImage || "",
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          color: item.color || "N/A", // Provide default if missing
          size: item.size,
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName || shippingAddress.name,
          phone: shippingAddress.phone,
          addressLine1: shippingAddress.addressLine1 || shippingAddress.address,
          addressLine2: shippingAddress.addressLine2 || "",
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode || shippingAddress.zipCode,
          country: shippingAddress.country || "India",
        },
        paymentDetails: {
          transactionId: paymentDetails.id,
          method: paymentDetails.method || "razorpay", // Default method
          status: paymentDetails.status,
        },
        orderTotal,
        orderStatus: 'Confirmed',
      };

      console.log("Creating order with data:", JSON.stringify(orderData, null, 2));

      savedOrder = await createOrder(orderData);
      console.log("Order created successfully");
    } catch (error) {
      console.error("Error creating order:", error);
      
      // Rollback stock update
      try {
        for (const item of cartItems) {
          await Product.findOneAndUpdate(
            { "productVariants._id": item.variantId, "productVariants.sizes.size": item.size },
            { $inc: { "productVariants.$.sizes.$[elem].stock": item.quantity } },
            { arrayFilters: [{ "elem.size": item.size }] }
          );
        }
        console.log("Stock rollback completed");
      } catch (rollbackError) {
        console.error("Critical: Failed to rollback stock:", rollbackError);
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to create order", details: error.message }),
        { status: 500 }
      );
    }

    // Final Response After Successful Verification and Order Creation
    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment verified and order created successfully",
        payment: {
          transaction_id: paymentDetails.id,
          order_id: paymentDetails.order_id,
          status: paymentDetails.status,
          amount: paymentDetails.amount / 100,
          currency: paymentDetails.currency,
          method: paymentDetails.method || "razorpay",
          created_at: new Date(paymentDetails.created_at * 1000).toISOString(),
        },
        order: savedOrder,
        stockUpdates: updatedProducts
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return new Response(
      JSON.stringify({ error: "Payment verification failed", code: "VERIFICATION_ERROR", details: error.message }),
      { status: 500 }
    );
  }
}