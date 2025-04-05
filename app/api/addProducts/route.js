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
    await connectDb();
    const formData = await req.formData();

    // Extract basic product data
    const productName = formData.get("productName");
    const productPrice = Number(formData.get("productPrice"));
    const productOldPrice = Number(formData.get("productOldPrice")) || null;
    const productCategory = formData.get("productCategory");
    const productType = formData.get("productType");
    const productBrand = formData.get("productBrand");
    const productDetails = JSON.parse(formData.get("productDetails") || "[]");

    // Validate required fields
    if (!productName || !productPrice || !productCategory || !productType || !productBrand) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }), 
        { status: 400 }
      );
    }

    // Get the variants data from the JSON string and validate
    let variantsData;
    try {
      variantsData = JSON.parse(formData.get("productVariants") || "[]");
    } catch (error) {
      console.error("Error parsing variants data:", error);
      return new Response(
        JSON.stringify({ message: "Invalid variants data format" }), 
        { status: 400 }
      );
    }
    
    if (!Array.isArray(variantsData) || variantsData.length === 0) {
      return new Response(
        JSON.stringify({ message: "At least one variant is required" }), 
        { status: 400 }
      );
    }

    // Process variants and upload images
    const processedVariants = await Promise.all(variantsData.map(async (variant, index) => {
      // Validate variant data
      if (!variant.color || !Array.isArray(variant.sizes) || variant.sizes.length === 0) {
        throw new Error(`Invalid data for variant ${index + 1}`);
      }

      // Process and validate sizes
      const sizes = variant.sizes.map(sizeData => {
        if (!sizeData.size || typeof sizeData.stock === 'undefined') {
          throw new Error(`Invalid size data for variant ${index + 1}`);
        }
        
        return {
          size: sizeData.size,
          stock: Number(sizeData.stock)
        };
      });

      // Handle image uploads
      const variantImages = formData.getAll(`variantImages_${index}`);
      if (!variantImages || variantImages.length === 0) {
        throw new Error(`Images are required for variant ${index + 1}`);
      }

      // Upload images to Cloudinary
      const uploadedImages = await Promise.all(
        variantImages.map(async (image) => {
          const buffer = await image.arrayBuffer();
          
          try {
            const uploadResult = await new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                { 
                  resource_type: "image",
                  folder: "products"
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );
              streamifier.createReadStream(Buffer.from(buffer)).pipe(uploadStream);
            });
            
            return uploadResult.secure_url;
          } catch (error) {
            throw new Error(`Failed to upload image for variant ${index + 1}: ${error.message}`);
          }
        })
      );

      // Return properly structured variant
      return {
        color: variant.color,
        sizes: sizes,
        images: uploadedImages
      };
    }));

    // Log the final processed variants for debugging
    console.log("Final processed variants:", JSON.stringify(processedVariants, null, 2));

    // Create and save the product
    const productData = {
      productName,
      productOldPrice,
      productPrice,
      productVariants: processedVariants,
      productDetails: productDetails.filter(detail => detail.trim()),
      productCategory,
      productType,
      productBrand
    };

    console.log("Final product data:", JSON.stringify(productData, null, 2));

    const newProduct = new Product(productData);

    // Validate before saving
    const validationError = newProduct.validateSync();
    if (validationError) {
      console.error("Validation error:", validationError);
      return new Response(
        JSON.stringify({ 
          message: "Validation failed", 
          error: validationError.message 
        }), 
        { status: 400 }
      );
    }

    await newProduct.save();

    return new Response(
      JSON.stringify({ 
        message: "Product added successfully",
        product: newProduct 
      }), 
      { status: 201 }
    );

  } catch (error) {
    console.error("Error adding product:", error);
    return new Response(
      JSON.stringify({ 
        message: "Failed to add product", 
        error: error.message 
      }), 
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


