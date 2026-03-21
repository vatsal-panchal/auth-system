import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstants = await mongoose.connect(`${process.env.MONGOD_URI}/${process.env.DB_NAME}`);
    console.log(`DB connected: ${connectionInstants.connection.host}`);
    
  } catch (error) {
    console.error("DB connection fail", error.message);
    process.exit(1)
  }
};


export default connectDB