import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
	throw new Error("Missing MONGO_URL environment variable");
};

const dbConnect = async () => {
	try {
		await mongoose.connect(mongoUrl);
		console.log("Successfully connected to database!");
	} catch (error) {
		console.log(error);
	};
};

export default dbConnect;
