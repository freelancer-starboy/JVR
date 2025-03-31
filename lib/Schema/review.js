import mongoose from "mongoose";


const ReviewSchema = new mongoose.Schema({
    user : {
        type : String,
        required : true
    },
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product",
        required : true
    },
    rating : {
        type : Number,
        required : true
    },
    imageUrls : [
        {
            type : String,
        }
    ],
    comment : {
        type : String,
        required : true
    }
})

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export default Review;