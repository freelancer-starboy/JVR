import connectDb from "@/lib/database/db"
import Address from "@/lib/Schema/addressSchema"

export async function POST(req) {
    try {
        const body = await req.json()
        const { userId } = body
        
        await connectDb()
        
        // Using find to get all addresses for the userId
        const addresses = await Address.find({ userId: userId })
        
        if (!addresses || addresses.length === 0) {
            return new Response(
                JSON.stringify({ message: "No addresses found for this user" }), 
                { status: 404 }
            )
        }

        return new Response(
            JSON.stringify({ 
                data: addresses, 
                message: "Addresses found successfully" 
            }), 
            { status: 200 }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ 
                message: "Internal server error", 
                error: error.message 
            }), 
            { status: 500 }
        )
    }
}