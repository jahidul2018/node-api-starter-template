const Company = require("../models/company_model");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { generateToken } = require("../auth/auth");

// token generation routes
exports.createToken = async (req, res, next) => {
	const companyId = req.params.id;
	try {
		// const token = generateSecretToken();
		const token = generateToken(companyId);

		console.log(token);

		const company = await Company.findByIdAndUpdate(
			companyId,
			{ token },
			{ new: true }
		);
		if (!company) {
			return next(createError(404, "company dose not exist."));
		}
		res
			.status(200)
			.json({ success: true, data: company, message: "token generate" });
	} catch (error) {
		next(error);
	}
};

// Create comaany
exports.create = async (req, res, next) => {
	// // validate request
	console.log(req.body);

	try {
		const { name, description } = req.body;
		// const token = generateSecretToken();
		// console.log(token);

		if (!name || !description) {
			return next(createError(400, "fields are required"));
		}
		// create
		const company = await Company.create({
			name,
			description,
		});

		// generate token

		//return 200 response with data
		res.status(200).json({
			success: true,
			count: company.length,
			data: company,
			message: "comapny created",
		});
	} catch (error) {
		res
			.status(error.status || error.message || error.code || error.errno || 500)
			.json({
				success: false,
				message: error.message || error,
			});
	}
};

// Retrieve and return all brand from the database.
exports.get = async (req, res, next) => {
	const companies = await Company.find();
	if (!companies) {
		return next(createError(400, "No data found"));
	}
	res.status(200).json({
		success: true,
		count: companies.length,
		message: `data found`,
		data: companies,
	});
};

// Find a single note with a brandId
exports.getById = async (req, res, next) => {
	const company = await Company.findById(req.params.Id);
	if (!company) {
		return next(createError(400, "No data found"));
	}
	res
		.status(200)
		.json({ success: true, data: company, message: `company data found` });
};

// Update a note identified by the brandId in the request
exports.update = async (req, res, next) => {
	// console.log(req.body);
	const { name, description, status } = req.body;

	if (!name || !description) {
		return next(createError(400, `fields are required`));
	}

	//find by brandId and update
	const company = await Company.findByIdAndUpdate(
		req.params.Id,
		{
			name,
			description,
			status,
		},
		{ new: true }
	);
	res
		.status(200)
		.json({ success: true, message: `data update`, data: company });
};

// Delete a note with the specified brandId in the request
exports.delete = async (req, res, next) => {
	const company = await Company.findByIdAndDelete(req.params.Id);
	if (!company) {
		return next(createError(400, "No data found"));
	}
	res
		.status(200)
		.json({ success: true, message: `company deleted!`, data: company });
};
