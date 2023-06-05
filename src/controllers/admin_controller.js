const Admin = require("../models/admin_model");
const createError = require("http-errors");
const Cce = require("../models/cce_model");
const bcrypt = require("bcrypt");

// register controler
// {host}/api/admin/signup
exports.register = async (req, res, next) => {
	try {
		// console.log(req.body);
		// check fields
		const { firstName, lastName, email, password, mobileNumber } = req.body;

		if (!firstName || !lastName || !email || !password || !mobileNumber) {
			return next(new createError(400, "please fill all the fields"));
		}

		// check for email and phoneNumber
		const adminCount = await Admin.countDocuments({
			$or: [{ email: email }, { mobileNumber: mobileNumber }],
		});

		// console.log(adminCount);

		// check for admin count if exist
		if (adminCount > 0) {
			return next(
				createError(
					400,
					"Admin aready exists with the same email or phone, please try again"
				)
			);
		}
		const admin = await Admin.create({
			firstName,
			lastName,
			email,
			mobileNumber,
			password,
		});
		res.status(201).json({
			success: true,
			data: admin,
			message: "admin create success",
		});
	} catch (error) {
		next(error);
	}
};

exports.login = async (req, res, next) => {
	const { email } = req.body;
	try {
		const admin = await Admin.findOne({ email });
		if (!admin) {
			return next(createError(404, "admin dose not exist"));
		}
		const isPasswordCorrect = await admin.matchPassword(req.body.password);
		if (!isPasswordCorrect) {
			return next(createError(403, "incorrect password"));
		}
		const token = await admin.getSignedToken();
		const { password, ...others } = admin._doc;
		res.status(200).json({
			success: true,
			data: { ...others, token },
			message: "login success",
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

exports.getAdmins = async (req, res, next) => {
	try {
		const admin = await Admin.find();
		if (!admin) {
			return next(createError(404, "admin dose not exist."));
		}
		res.status(200).json({
			success: true,
			count: admin.length,
			data: admin,
			message: "admin found",
		});
	} catch (error) {
		// next(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

exports.getAdminById = async (req, res, next) => {
	const adminId = req.params.id;
	try {
		const admin = await Admin.findById(adminId);
		if (!admin) {
			return next(createError(404, "admin dose not exist."));
		}
		res.status(200).json({
			success: true,
			data: admin,
			message: "admin found",
		});
	} catch (error) {
		// next(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

exports.me = async (req, res, next) => {
	console.log("me");
	try {
		const admin = req.auth;
		return res.status(200).json({
			success: true,
			data: admin,
			message: "admin found",
		});
	} catch (error) {
		// next(error);
		res.status(500).json({
			success: false,
			message: `404 - data not found ` + error.message,
		});
	}
};
