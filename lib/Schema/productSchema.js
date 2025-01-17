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
    
    productColor : {
        type : [String],
        require: true
    },
    productSize : [
        {
            type : [String],
            required : true
        }
    ],
    productStock : {
        type : Number,
        required : true
    },
    productImage: {
        type: [String],
        required: true
    },
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
