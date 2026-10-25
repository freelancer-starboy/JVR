import mongoose from "mongoose";


const ReviewSchema = new mongoose.Schema({
    user : {
        type : String,
        required : true
    },
    // Firebase UID of the author. Older reviews (before login was required) don't have it.
    userId : {
        type : String,
        index : true
    },
    userEmail : {
        type : String
    },
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product",
        required : true
    },
    rating : {
        type : Number,
        required : true,
        min : 1,
        max : 5
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
},
{
    timestamps : true
})

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export default Review;
