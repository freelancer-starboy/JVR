import connectDb from "@/lib/database/db";
import Address from "@/lib/Schema/addressSchema";

export async function POST(req) {
    const body = await req.json();
        const { 
            userId, 
            fullName, 
            phone, 
            addressType, 
            addressLine1, 
            addressLine2, 
            city, 
            state, 
            postalCode, 
            country 
        } = body;
    try {
        await connectDb()
        const saveAddress = new Address({userId,
                fullName,
                phone,
                addressType,
                addressLine1,
                addressLine2,
                city,
                state,
                postalCode,
                country
        })

        await saveAddress.save();
        return new Response(JSON.stringify({message : "Address saved successfully"}), {status : 201})
    } catch (error) {
        console.log("Error saving Address ", error)
        return new Response(JSON.stringify({ message : "Failed to add Address"}), {status : 500})
    }
}


