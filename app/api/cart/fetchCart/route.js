import connectDb from "@/lib/database/db"
import Cart from "@/lib/Schema/cartSchema"

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
    try {
        const quan = Number(quantity)
        await connectDb()
        const data = await Cart.findOneAndUpdate({ "items.productId": id }, { $set: { "items.$.quantity": quan } }, { new : true})
        if (!data) {
            return new Response(JSON.stringify({ message: "Item not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response({ message : error.message}, {status : 500})
    }
}

export async function DELETE(req){
    try {
        const  {id}  = await req.json()
        const data = await Cart.findOneAndUpdate(
            { "items.productId": id },
            { $pull: { items: { productId: id } } },
            { new: true }
        );
        if (!data) {
            return new Response(JSON.stringify({ message: "Item not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response({ message : error.message}, {status : 500})
    }
}