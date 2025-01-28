import connectDb from "@/lib/database/db";
import Product from "@/lib/Schema/productSchema";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary configuration
cloudinary.config({
  cloud_name: "drojxcxa1",
  api_key: "316898787323286",
  api_secret: "en2gIyAB52RDFk7d3VN9K0ua3LM",
});

// POST Route - Add Product
export async function POST(req) {
  try {
    // Connect to the database
    await connectDb();

    // Parse incoming form data
    const formData = await req.formData();

    // Extract basic product data
    const productName = formData.get("productName");
    const productPrice = parseFloat(formData.get("productPrice"));
    const productOldPrice = parseFloat(formData.get("productOldPrice")) || 0;
    const productCategory = formData.get("productCategory");
    const productType = formData.get("productType");
    const productBrand = formData.get("productBrand");
    const productDetails = formData.getAll("productDetails");

    // Validate required fields
    if (
      !productName ||
      !productPrice ||
      !productCategory ||
      !productType ||
      !productBrand ||
      productDetails.length === 0
    ) {
      return new Response(
        JSON.stringify({ message: "All required fields must be filled." }),
        { status: 400 }
      );
    }

    // Handle product variants
    const processedVariants = [];
    let variantIndex = 0;

    while (formData.has(`productVariants[${variantIndex}][color]`)) {
      const color = formData.get(`productVariants[${variantIndex}][color]`);
      const size = JSON.parse(
        formData.get(`productVariants[${variantIndex}][size]`) || "[]"
      );
      const stock = parseInt(
        formData.get(`productVariants[${variantIndex}][stock]`) || "0",
        10
      );

      if (!color || size.length === 0 || stock <= 0) {
        return new Response(
          JSON.stringify({
            message: `Invalid data for variant ${variantIndex + 1}.`,
          }),
          { status: 400 }
        );
      }

      const images = [];
      let imageIndex = 0;

      while (
        formData.has(`productVariants[${variantIndex}][images][${imageIndex}]`)
      ) {
        const image = formData.get(
          `productVariants[${variantIndex}][images][${imageIndex}]`
        );

        // Upload image to Cloudinary
        const buffer = await image.arrayBuffer();
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(Buffer.from(buffer)).pipe(uploadStream);
        });

        images.push(uploadResult.url);
        imageIndex++;
      }

      if (images.length === 0) {
        return new Response(
          JSON.stringify({
            message: `Images are required for variant ${variantIndex + 1}.`,
          }),
          { status: 400 }
        );
      }

      processedVariants.push({ color, size, stock, images });
      variantIndex++;
    }

    if (processedVariants.length === 0) {
      return new Response(
        JSON.stringify({
          message: "At least one product variant is required.",
        }),
        { status: 400 }
      );
    }

    // Create and save the product
    const newProduct = new Product({
      productName,
      productOldPrice,
      productPrice,
      productVariants: processedVariants,
      productDetails,
      productCategory,
      productType,
      productBrand,
    });

    await newProduct.save();

    return new Response(
      JSON.stringify({ message: "Product added successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return new Response(
      JSON.stringify({ message: `Failed to add product: ${error.message}` }),
      { status: 500 }
    );
  }
}


// GET Route - Fetch All Products
export async function GET(req) {
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


