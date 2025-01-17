import connectDb from "@/lib/database/db";
import Cart from "@/lib/Schema/cartSchema";

export async function DELETE(req) {
  const { userId } = await req.json();
  await connectDb();

  try {
    // Find the cart by userId and remove the items array
    const data = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } }, // Sets the 'items' array to an empty array
      { new: true } // Returns the updated document
    );

    if (!data) {
      return new Response(
        JSON.stringify({ message: "Cart not found for the user" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }
}
