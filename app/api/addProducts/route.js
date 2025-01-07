import connectDb from "@/lib/database/db";
import Product from "@/lib/Schema/productSchema";
import streamifier from 'streamifier';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'drojxcxa1',
  api_key: '316898787323286',
  api_secret: 'en2gIyAB52RDFk7d3VN9K0ua3LM',
});

export async function POST(req) {
  try {
    // Establish database connection
    await connectDb();

    // Parse form data
    const formData = await req.formData();
    const productName = formData.get('productName');
    const productPrice = formData.get('productPrice');
    const productDescription = formData.get('productDescription');
    const productCategory = formData.get('productCategory');
    const productType = formData.get('productType');
    const productBrand = formData.get('productBrand');
    
    // Validate required fields
    if (!productName || !productPrice || !productDescription || !productCategory || !productType || !productBrand) {
      return new Response(
        JSON.stringify({ message: 'All fields are required' }),
        { status: 400 }
      );
    }

    // Handle image uploads
    const productImages = formData.getAll('productImage');
    if (productImages.length === 0) {
      return new Response(
        JSON.stringify({ message: 'At least one product image is required' }),
        { status: 400 }
      );
    }

    // Upload images to Cloudinary
    const uploadedImageUrls = await Promise.all(
      productImages.map(async (image) => {
        const buffer = await image.arrayBuffer();
        try {
          const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { resource_type: "image" },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
            streamifier.createReadStream(Buffer.from(buffer)).pipe(uploadStream);
          });
          return uploadResult.url;
        } catch (error) {
          throw new Error(`Image upload failed: ${error.message}`);
        }
      })
    );

    // Create and save the product
    const newProduct = new Product({
      productName,
      productPrice,
      productImage: uploadedImageUrls,
      productDescription,
      productCategory,
      productType,
      productBrand,
    });
    await newProduct.save();

    return new Response(
      JSON.stringify({ message: "Product added successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error); // Log the error for debugging
    return new Response(
      JSON.stringify({ message: `Failed to add product: ${error.message}` }),
      { status: 500 }
    );
  }
}


export async function GET(req){
  try {
    await connectDb()
    const data = await Product.find({})
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    return new Response( { status : 500}, JSON.stringify({ message : error.message }))
  }
}