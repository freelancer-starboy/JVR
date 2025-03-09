import mongoose from "mongoose";


const ContactFormSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    subject : {
        type: String,
        required : true
    },
    message : {
        type : String,
        required : true
    },
    phoneNumber : {
        type : Number,
        required : true
    },
    replies : [
        {
            email: { type: String, required: true },
            message: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    isOpened : {
        type : Boolean,
        default : false
    }
}, {
    timestamps : true
})


const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactFormSchema);

export default Contact