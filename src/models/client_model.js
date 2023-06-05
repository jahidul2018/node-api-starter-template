const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const ClientSchema = new mongoose.Schema(
	{
		company: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Company",
			required: [false, "company is required"],
		},
		clientinfo: {
			type: Object,
		},
		type: {
			type: String,
			enum: ["api", "reschedule"],
			default: "api",
		},

		appiontmentDate: {
			type: Date,
			required: [false, "appiontmentDate is required"],
		},

		cce: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Cce",
			required: [false, "counsellerId is required"],
		},
		comment: {
			type: String,
			required: [false, "comment is required"],
		},
		status: {
			type: Boolean,
			default: true,
		},
		counsellorId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Counsellor",
		},
		role: {
			type: String,
			default: "client",
		},
	},
	{ timestamps: true }
);

ClientSchema.methods.getSignedToken = function () {
	return jwt.sign({ id: this._id, role: this.role }, process.env.TOKENSECRATE);
};

module.exports = mongoose.model("Client", ClientSchema);
