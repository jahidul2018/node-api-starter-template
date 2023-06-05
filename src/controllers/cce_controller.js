const Cce = require("../models/cce_model");
const createError = require("http-errors");

// {host}/api/cce/signin
exports.login = async (req, res, next) => {
	const { email } = req.body;

	console.log(req.body);

	try {
		const cce = await Cce.findOne({ email });
		if (!cce) {
			return next(createError(403, "cce client not found"));
		}
		const isPasswordCorrect = await cce.matchPassword(req.body.password);
		if (!isPasswordCorrect) {
			return next(createError(403, "incorrect password"));
		}

		const token = await cce.getSignedToken();
		const { password, ...others } = cce._doc;
		res.status(201).json({
			success: true,
			data: { ...others, token },
			message: "login success",
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

// get all
exports.getAll = async (req, res, next) => {
	try {
		const cce = await Cce.find();
		res.status(200).json({
			success: true,
			count: cce.length,
			data: cce,
			message: "get all cce list",
		});
	} catch (error) {
		next(error);
	}
};

// get single
exports.getSingle = async (req, res, next) => {
	const cceId = req.params.id;
	try {
		const cce = await Cce.findById(cceId);
		if (!cce) {
			return next(createError(404, "cce dose not exist."));
		}
		res.status(200).json({
			success: true,
			data: agent,
			message: "cce data fatch",
		});
	} catch (error) {
		next(error);
	}
};

//update single
exports.update = async (req, res, next) => {
	try {
		const { fristName, lastName, email, mobileNumber } = req.body;
		const updateCce = await Cce.findByIdAndUpdate(
			req.params.id,
			{ fristName, lastName, email, mobileNumber },
			{ new: true }
		);

		if (!updateCce) {
			return next(createError(404, "cce dose not exist."));
		}
		res
			.status(200)
			.json({ success: true, data: updateCce, message: "cce update success" });
	} catch (error) {
		res.status(500).json({ success: false, message: "server error" });
	}
};

// delete single
exports.delete = async (req, res, next) => {
	try {
		const cceId = req.params.id;
		const deleteCce = await Cce.findByIdAndDelete(cceId);
		if (!deleteCce) {
			return next(createError(404, "cce dose not exist."));
		}
		res
			.status(200)
			.json({ success: true, data: deleteCce, message: "cce delete success" });
	} catch (error) {
		res.status(500).json({ success: false, message: "server error" });
	}
};

exports.create = async (req, res, next) => {
	try {
		console.log(req.body);
		const { firstName, lastName, email, password, mobileNumber } = req.body;

		if (!firstName || !lastName || !email || !password || !mobileNumber) {
			return next(createError(400, "please fill all the fields"));
		}

		// check for email and phoneNumber
		const Count = await Cce.countDocuments({
			$or: [{ email: email }, { mobileNumber: mobileNumber }],
		});

		// console.log(adminCount);

		// check for count if exist
		if (Count > 0) {
			return next(
				createError(
					400,
					"Aready exists with the same email or phone, please try again"
				)
			);
		}

		const cce = await Cce.create({
			firstName,
			lastName,
			email,
			password,
			mobileNumber,
		});
		res.status(200).json({
			success: true,
			count: cce.length,
			data: cce,
			message: "cce user created",
		});
	} catch (error) {
		res
			.status(500)
			.json({ success: false, message: "somethis went wrong - 500 " });
	}
};
