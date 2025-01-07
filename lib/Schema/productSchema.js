import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productImage: {
        type: [String],
        required: true
    },
    productDescription: {
        type: String,
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
