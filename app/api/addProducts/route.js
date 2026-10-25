import connectDb from "@/lib/database/db";
import Product from "@/lib/Schema/productSchema";

export const dynamic = "force-dynamic";

// Products are uploaded from the admin dashboard (JVR-ADMIN), which requires an admin login.
// This public endpoint had no authentication, so uploading from the storefront is switched off.
export async function POST() {
  return new Response(
    JSON.stringify({ message: "Products are managed from the admin dashboard" }),
    { status: 403, headers: { "Content-Type": "application/json" } }
  );
}

export async function GET() {
  try {
    await connectDb();
    const data = await Product.find({});
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }
}
