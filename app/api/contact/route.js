import connectDb from "@/lib/database/db"
import Contact from "@/lib/Schema/contactFormSchema"

export async function POST(req, res){
    try {

        const body = await req.json()
        const { name, email, phoneNumber, subject, message } = body
        if(!name || !email || !phoneNumber || !subject || !message){
            return new Response(JSON.stringify({message : "All fields are required", statusCode : 400}), {status : 400})
        }

        await connectDb()

        const response = new Contact({name, email, phoneNumber, subject, message})
        await response.save()
        return new Response(JSON.stringify({message : "Message sent successfully", statusCode : 200}), {status : 200})
    } catch (error) {
        return new Response(JSON.stringify({message : error.message, statusCode : 500}), {status : 500})
    }
}