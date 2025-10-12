import crypto from "crypto";
import connectDb from "@/lib/database/db";
import Checkout from "@/lib/Schema/checkoutSchema";
import Product from "@/lib/Schema/productSchema";

function validateWebhookSignature(bodyText, signature, secret) {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(bodyText)
    .digest("hex");
  
  return expectedSignature === signature;
}

async function updateProductStock(cartItems) {
  let updatedProducts = [];
  
  for (const item of cartItems) {
    const { variantId, size, quantity } = item;

    if (!variantId || !size) {
      console.error(`Missing variantId or size for item`, item);
      continue;
    }
    
    // Find the product that contains the variant
    const productData = await Product.findOne({ "productVariants._id": variantId });

    if (!productData) {
      console.error(`Product with variant ${variantId} not found`);
      continue;
    }

    // Find the specific variant within the product
    const variant = productData.productVariants.find(v => v._id.toString() === variantId);

    if (!variant) {
      console.error(`Variant ${variantId} not found`);
      continue;
    }

    // Find the selected size within the variant
    const sizeItem = variant.sizes.find(s => s.size.trim() === size.trim());

    if (!sizeItem) {
      console.error(`Size ${size} not found for variant ${variantId}`);
      continue;
    }

    // Update the stock for the size within the selected variant
    const updatedProduct = await Product.findOneAndUpdate(
      { "productVariants._id": variantId, "productVariants.sizes.size": size },
      { $inc: { "productVariants.$.sizes.$[elem].stock": -quantity } },
      { 
        new: true, 
        arrayFilters: [{ "elem.size": size }] 
      }
    );

    if (updatedProduct) {
      updatedProducts.push({
        productId: updatedProduct._id,
        productName: updatedProduct.productName,
        variantId: variantId,
        size: size,
      });
    }
  }
  
  return updatedProducts;
}

async function handlePaymentCaptured(payment) {
  try {
    await connectDb();
    
    // Find order by razorpay order_id
    const order = await Checkout.findOne({
      'paymentDetails.orderId': payment.order_id
    });
    
    if (!order) {
      console.log(`Order not found for payment ${payment.id}`);
      return { status: 'order_not_found' };
    }
    
    // Check if already processed
    if (order.orderStatus === 'Confirmed' && order.paymentDetails.paymentStatus === 'captured') {
      console.log(`Payment ${payment.id} already processed`);
      return { status: 'already_processed' };
    }
    
    // Update order status
    order.orderStatus = 'Confirmed';
    order.paymentDetails.paymentStatus = 'captured';
    order.paymentDetails.transactionId = payment.id;
    
    await order.save();
    
    // Update stock if not already updated
    if (!order.stockUpdated) {
      await updateProductStock(order.cartItems);
      order.stockUpdated = true;
      await order.save();
    }
    
    return { status: 'success', order };
  } catch (error) {
    console.error('Error handling payment.captured:', error);
    throw error;
  }
}

async function handlePaymentFailed(payment) {
  try {
    await connectDb();
    
    const order = await Checkout.findOne({
      'paymentDetails.orderId': payment.order_id
    });
    
    if (order) {
      order.orderStatus = 'Failed';
      order.paymentDetails.paymentStatus = 'failed';
      await order.save();
    }
    
    return { status: 'updated' };
  } catch (error) {
    console.error('Error handling payment.failed:', error);
    throw error;
  }
}

async function handleOrderPaid(order) {
  try {
    await connectDb();
    
    // Find order by razorpay order_id
    const dbOrder = await Checkout.findOne({
      'paymentDetails.orderId': order.id
    });
    
    if (!dbOrder) {
      console.log(`Order not found: ${order.id}`);
      return { status: 'order_not_found' };
    }
    
    // Check if already processed
    if (dbOrder.orderStatus === 'Confirmed') {
      console.log(`Order ${order.id} already confirmed`);
      return { status: 'already_processed' };
    }
    
    // Update order status
    dbOrder.orderStatus = 'Confirmed';
    dbOrder.paymentDetails.paymentStatus = 'paid';
    
    await dbOrder.save();
    
    // Update stock if not already updated
    if (!dbOrder.stockUpdated) {
      await updateProductStock(dbOrder.cartItems);
      dbOrder.stockUpdated = true;
      await dbOrder.save();
    }
    
    return { status: 'success', order: dbOrder };
  } catch (error) {
    console.error('Error handling order.paid:', error);
    throw error;
  }
}

export async function POST(req) {
  try {
    // Get webhook signature from headers
    const signature = req.headers.get('x-razorpay-signature');
    
    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing webhook signature" }),
        { status: 400 }
      );
    }
    
    // Get webhook secret from environment
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error("Missing Razorpay webhook secret");
      return new Response(
        JSON.stringify({ error: "Webhook configuration error" }),
        { status: 500 }
      );
    }
    
    // Parse request body - read as text first for signature verification
    const bodyText = await req.text();
    const body = JSON.parse(bodyText);
    
    // Validate webhook signature
    const isValidSignature = validateWebhookSignature(bodyText, signature, webhookSecret);
    
    if (!isValidSignature) {
      console.error("Invalid webhook signature");
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 401 }
      );
    }
    
    console.log("Webhook Event:", body.event);
    
    // Handle different webhook events
    let result;
    
    switch (body.event) {
      case 'payment.captured':
        result = await handlePaymentCaptured(body.payload.payment.entity);
        break;
        
      case 'payment.failed':
        result = await handlePaymentFailed(body.payload.payment.entity);
        break;
        
      case 'order.paid':
        result = await handleOrderPaid(body.payload.order.entity);
        break;
        
      default:
        console.log(`Unhandled webhook event: ${body.event}`);
        return new Response(
          JSON.stringify({ message: "Event received but not processed" }),
          { status: 200 }
        );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        event: body.event,
        result 
      }),
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Webhook Error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Webhook processing failed", 
        details: error.message 
      }),
      {       status: 500 }
    );
  }
}