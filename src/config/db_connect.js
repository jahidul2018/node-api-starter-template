const mongoose = require("mongoose");

const db = async () => {
	try {
		// console.log(process.env.DATABASE_CONNECTION_STRING)
		// await mongoose.set("strictQuery", false);
		await mongoose.connect(
			process.env.DATABASE_CONNECTION_STRING,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			},
			() => {
				console.log("databes has been conected form db_connect");
			}
		);
	} catch (error) {
		throw new Error(error);
		// console.log(error.message)
	}
};

module.exports = db;
