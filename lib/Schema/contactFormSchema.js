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
    }
})


const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactFormSchema);

export default Contact