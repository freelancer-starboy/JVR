
import connectDb from "@/lib/database/db";
import Cart from "@/lib/Schema/cartSchema";

export async function DELETE(req){
    const { userId } = await req.json()
    await connectDb()
    try {
        const data = await Cart.findOneAndDelete({ userId })
        if(!data){
            return new Response(
                JSON.stringify({ message: "Cart not found for the user" }),
                { status: 404 })
        }
        return new Response(JSON.stringify(data), {status : 200})
    } catch (error) {
        return new Response(JSON.stringify({message : error.message}), {status : 500})
    }
}