const mongoose = require("mongoose");

const CounsellorSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			unique: true, // this will make sure that no two users can have the same email
			required: true,
		},
		whatsapp: {
			type: String,
			required: false,
		},
		role: {
			type: String,
			default: "counsellor",
		},
		status: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Counsellor", CounsellorSchema);
