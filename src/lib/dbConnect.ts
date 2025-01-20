// in pure express js or js the db is connected continously but as nextjs is edge time framework the db connection is only made when the request is made
// and the db connection is closed when the request is completed and repeat when we need it so to optimize we first check 
// to avoid the wasting to connect if there is already a connection


import mongoose from "mongoose";

type ConnectionObject = {
    isconnected?:number;
    // it can be string also
};

const connection: ConnectionObject = {};

// as we know database is in the other continent so it takes time and chance of failure
async function dbConnect(): Promise<void> {

    if (connection.isconnected) {
        console.log("already connected database");
        return;
    }
   try {
      const db = await mongoose.connect(process.env.MONGODB_URI || "",{});
      console.log("hello")
      connection.isconnected = db.connections[0].readyState
      console.log("connected database");
   } catch (error) {
      console.log("database connection failed",error);
      process.exit(1);
   }
}

export default dbConnect;