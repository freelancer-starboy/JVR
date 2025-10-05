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
                type: [String],
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
}, {
    strict: true,  // ADD THIS
    timestamps: false  // ADD THIS if you don't want createdAt/updatedAt
});

// CLEAR THE MODEL CACHE - This is the key fix!
if (mongoose.models.Product) {
    delete mongoose.models.Product;
}

const Product = mongoose.model('Product', productSchema);

export default Product;