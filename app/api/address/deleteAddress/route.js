import connectDb from "@/lib/database/db"
import Address from "@/lib/Schema/addressSchema"

export async function DELETE(req){
    const {searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if(!id){
        return new Response(JSON.stringify({message : "User Id not found"}), {status : 500})
    }
    try {
        await connectDb()
        const data = await Address.findByIdAndDelete(id)
        if(!data){
            return new Response(JSON.stringify({message : "Address not found"}), {status : 404})
        }
        return new Response(JSON.stringify({message : "Address deleted."}), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 })
    }
}