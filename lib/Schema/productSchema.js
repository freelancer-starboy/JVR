import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productOldPrice: {
        type: Number,
    },
    productPrice: {
        type: Number,
        required: true
    },
    productVariants: [
        {
            color: {
                type: String,
                required: true
            },
            sizes: [
                {
                    size : {
                        type: String,
                        required: true
                    },
                    stock: {
                        type: Number,
                        required: true
                    }
                }
            ],
            images: {
                type: [String], // Array of image URLs for this color variant
                required: true
            },
        }
    ],
    productDetails: {
        type: [String],
        required: true
    },
    productCategory: {
        type: String,
        required: true
    },
    productType: {
        type: String,
        required: true
    },
    productBrand: {
        type: String,
        required: true
    },
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
