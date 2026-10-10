import mongoose from "mongoose"

export async function db() {
    try {
        const con = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`database is connected ${con.connection.host}`)
    } catch (error) {
        console.log('erorr in connecting db', error);
         process.exit(1)
    }
}