const Counsellor = require("../models/counsellor_model");
const createError = require("http-errors");
const { paginations } = require("../pagination/pagination");

// get all clients
// {host}/api/counsellor/

exports.getAllCounsellor = async (req, res, next) => {
	try {
		const counsellor = await Counsellor.find();
		if (!counsellor) {
			return next(createError(404, "no counsellor exist."));
		}
		res.status(200).json({
			success: true,
			count: counsellor.length,
			data: counsellor,
			message: "counsellor list",
		});
	} catch (error) {
		// next(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// get single counsellor
// get {host}/api/counsellor/:id
exports.getCounsellorById = async (req, res, next) => {
	const counsellorId = req.params.id;
	try {
		const counsellor = await Counsellor.findById(counsellorId);
		if (!counsellor) {
			return next(createError(404, "counsellor dose not exist."));
		}
		res.status(200).json({
			success: true,
			length: counsellor.length,
			data: counsellor,
			message: "counsellor found",
		});
	} catch (error) {
		// next(error);
		res.status(500).json({
			success: false,
			message: `something went wrong please try again - ` + error.message,
		});
	}
};

// create counsellor
// post {host}/api/counsellor/

exports.createCounsellor = async (req, res, next) => {
	const { name, email, whatsapp } = req.body;
	try {
		const counsellor = await Counsellor.create({
			name,
			email,
			whatsapp,
		});
		if (!counsellor) {
			return res.status(404).json({ status: 404, message: errorMessage });
		}
		res.status(201).json({
			success: true,
			count: Counsellor.length,
			data: counsellor,
			message: "counsellor created",
		});
	} catch (error) {
		// next(error);
		res.status(500).json({
			success: false,
			message: `something went wrong please try again - ` + error.message,
		});
	}
};

// update counsellor
// put {host}/api/counsellor/:id
exports.updateCounsellor = async (req, res, next) => {
	try {
		const { name, email, whatsapp } = req.body;
		const counsellorId = req.params.id;
		const counsellor = await Counsellor.findByIdAndUpdate(
			counsellorId,
			{
				name,
				email,
				whatsapp,
			},
			{ new: true }
		);
		if (!counsellor) {
			return next(createError(404, "counsellor dose not exist."));
		}
		res.status(200).json({
			success: true,
			data: counsellor,
			message: "counsellor updated",
		});
	} catch (error) {
		// next(error);
		res.status(500).json({
			success: false,
			message: `something went wrong please try again - ` + error.message,
		});
	}
};

// delete counsellor
// delete {host}/api/counsellor/:id

exports.deleteCounsellor = async (req, res, next) => {
	try {
		const counsellorId = req.params.id;

		const counsellor = await Counsellor.findByIdAndDelete(counsellorId);
		if (!counsellor) {
			return next(createError(404, "counsellor dose not exist."));
		}
		res.status(200).json({
			success: true,
			data: counsellor,
			message: "counsellor deleted",
		});
	} catch (error) {
		// next(error);
		res.status(500).json({
			success: false,
			message: `something went wrong please try again - ` + error.message,
		});
	}
};
