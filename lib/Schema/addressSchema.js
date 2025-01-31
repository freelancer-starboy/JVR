import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressType: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
});

const Address = mongoose.models.Address || mongoose.model('Address', addressSchema);

export default Address;