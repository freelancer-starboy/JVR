import mongoose from 'mongoose'

let isConnected = false

const connectDb = async () => {
    if(isConnected){
        console.log("Mongo DB is connected")
        return
    }
    try {
        const db = await mongoose.connect(`mongodb+srv://yogesh5prog:bbOBJPCyzdejiaOT@cluster0.baotudi.mongodb.net/JVR
`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        isConnected = db.connections[0].readyState === 1
        console.log("Mongo DB is connected")
    } catch (error) {
        console.log(error, "Failed to connect DB")
        throw new Error("Failed to connect to mongoose")
    }

}

export default connectDb