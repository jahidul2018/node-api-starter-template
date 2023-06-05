const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const CceSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		mobileNumber: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			default: "cce",
		},
		apiStatus: {
			type: Boolean,
			default: true,
		},
		status: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

CceSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

CceSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

CceSchema.methods.getSignedToken = function () {
	return jwt.sign({ id: this._id, role: this.role }, process.env.TOKENSECRATE);
};

module.exports = mongoose.model("Cce", CceSchema);
