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
    try {
        const { searchParams } = new URL(req.url)
        const userId = searchParams.get('userId') // Get userId from query params
        const { id, quantity } = await req.json()
        

        if (!userId) {
            return new Response(JSON.stringify({ 
                message: "User ID is required"
            }), { status: 400 });
        }

        // Ensure quantity is a valid number (allow 0 for potential deletion)
        const quan = Number(quantity)
        if (isNaN(quan) || quan < 0) {
            return new Response(JSON.stringify({ 
                message: "Invalid quantity",
                details: { id, quantity }
            }), { status: 400 });
        }

        // If quantity is 0, delete the item instead
        if (quan === 0) {
            await connectDb()
            const data = await Cart.findOneAndUpdate(
                { 
                    userId,
                    "items.productId": id // Keep as string, let Mongoose handle conversion
                },
                { $pull: { items: { productId: id } } },
                { new: true }
            );
            if (!data) {
                return new Response(JSON.stringify({ 
                    message: "Item not found"
                }), { status: 404 });
            }
            return new Response(JSON.stringify(data), { status: 200 });
        }

        await connectDb()
        // Update with userId filter
        const data = await Cart.findOneAndUpdate(
            { 
                userId,
                "items.productId": id // Mongoose will handle string to ObjectId conversion
            }, 
            { 
                $set: { 
                    "items.$.quantity": quan, 
                    "items.$.updatedAt": new Date() 
                } 
            }, 
            { 
                new: true,
                runValidators: true
            }
        )

        if (!data) {
            return new Response(JSON.stringify({ 
                message: "Cart or item not found",
                details: { userId, id }
            }), { status: 404 });
        }
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error("Update Error:", error);
        return new Response(JSON.stringify({ 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }), {status: 500})
    }
}
export async function DELETE(req){
    try {
        const { searchParams } = new URL(req.url)
        const userId = searchParams.get('userId')
        const { id } = await req.json()
        
        console.log("Received Delete Request:", { userId, id });

        if (!userId) {
            return new Response(JSON.stringify({ 
                message: "User ID is required"
            }), { status: 400 });
        }

        if (!id) {
            return new Response(JSON.stringify({ 
                message: "Product ID is required"
            }), { status: 400 });
        }

        await connectDb()
        
        const data = await Cart.findOneAndUpdate(
            { 
                userId,
                "items.productId": id 
            },
            { $pull: { items: { productId: id } } },
            { new: true }
        );

        if (!data) {
            console.error("No item found to delete");
            return new Response(JSON.stringify({ 
                message: "Cart or item not found",
                details: { userId, id }
            }), { status: 404 });
        }

        console.log("Delete successful:", data);
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error("Delete Error:", error);
        return new Response(JSON.stringify({ 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }), { status: 500 });
    }
}