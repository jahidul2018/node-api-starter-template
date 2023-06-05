const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const { v4: uuidv4 } = require("uuid");

const CompanySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		details: {
			type: String,
			required: false,
		},
		token: {
			type: String,
			required: false,
		},
		status: {
			type: Boolean,
			default: true,
		},
		role: {
			type: String,
			default: "company",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Company", CompanySchema);
