import mongoose from "mongoose";
import { DatabaseConnectionObject } from "@/types/main.types";


const connection: DatabaseConnectionObject = {

}

const dbURI = process.env.MONGO_DB_URI

if (!dbURI) {
    throw new Error("Database URI is not defined!")
}

export const conntectDb = async (): Promise<void> => {
    //* Checking if database is already connected
    if (connection.isConntected) {
        console.log("Already Connected To Database");
        return;
    }



    try {
        const connectionInstance = await mongoose.connect(dbURI)
        connection.isConntected = connectionInstance.connections[0].readyState
        const { host, port, name } = connectionInstance.connection;

        console.log(`Connected to database at ${host}:${port}/${name}`);
    } catch (error) {
        console.log("Database Connection Failed", error);
        process.exit()
    }
}