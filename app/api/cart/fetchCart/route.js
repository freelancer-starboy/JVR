import connectDb from "@/lib/database/db"
import Cart from "@/lib/Schema/cartSchema"
import mongoose from "mongoose"

export async function GET(req){
    try {
        const {searchParams } = new URL(req.url)
        const userId = searchParams.get('userId')
        if(!userId){
            return new Response(JSON.stringify({message : "User Id not found"}), {status : 500})
        }
        await connectDb()
        const data = await Cart.findOne({userId})
        if(!data){
            return new Response({message : "Cart not found"}, {status : 500})
        }
        return new Response(JSON.stringify(data.items), {status : 200})
    } catch (error) {
        console.log(error.message)
        return new Response({message : error.message}, {status : 500})
    }
}


export async function PUT(req){
    const { id, quantity } = await req.json()
    console.log("Received Update Request:", { id, quantity });

    try {
        // Ensure quantity is a valid number
        const quan = Number(quantity)
        if (isNaN(quan) || quan <= 0) {
            return new Response(JSON.stringify({ 
                message: "Invalid quantity",
                details: { id, quantity }
            }), { status: 400 });
        }

        await connectDb()
        
        const data = await Cart.findOneAndUpdate(
            { "items.productId": new mongoose.Types.ObjectId(id) }, 
            { $set: { "items.$.quantity": quan, "items.$.updatedAt": new Date() } }, 
            { 
                new: true,
                runValidators: true
            }
        )

        if (!data) {
            return new Response(JSON.stringify({ 
                message: "Item not found",
                details: { id, quantity }
            }), { status: 404 });
        }
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error("Update Error:", error);
        return new Response(JSON.stringify({ 
            message: error.message,
            details: { id, quantity }
        }), {status: 500})
    }
}
export async function DELETE(req){
    try {
        const  {id}  = await req.json()
        await connectDb()
        const data = await Cart.findOneAndUpdate(
            { "items.productId": id },
            { $pull: { items: { productId: id } } },
            { new: true }
        );
        if (!data) {
            console.error("No item found to delete");
            return new Response(JSON.stringify({ message: "Item not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error("Delete Error:", error);
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}