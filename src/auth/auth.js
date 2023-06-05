const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// for custom token
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const company_model = require("../models/company_model");

const auth = (roles = []) => {
	if (typeof roles === "string") {
		roles = [roles];
	}
	return async (req, res, next) => {
		if (
			!req.headers.authorization &&
			!req?.headers?.authorization?.startsWith("Bearer")
		) {
			return next(createError(403, "Authorization token is required"));
		}
		const token = req.headers.authorization.replace("Bearer ", "");
		console.log(token);
		try {
			const isvarified = await jwt.verify(token, process.env.TOKENSECRATE);
			if (!isvarified) {
				console.log(isvarified);
				return next(createError(403, "Invalid Token"));
			}
			if (roles.length > 0) {
				if (roles.includes(isvarified.role)) {
					req.auth_id = isvarified.id;
					req.role = isvarified.role;
					next();
				} else {
					return next(
						createError(403, `Only ${roles.toString()} can do this request.`)
					);
				}
			} else {
				req.auth_id = isvarified.id;
				req.role = isvarified.role;
				next();
			}
		} catch (error) {
			return next(error);
		}
	};
};

// authorization error handler for authorization errors;
const authorize = (roles = []) => {
	// covert single string to array with same name as roles
	if (typeof roles === "string") {
		roles = [roles];
	}
	return (req, res, next) => {
		try {
			// get the authorization token from the request header
			const tokenWithBearer = req.header("Authorization");

			if (!tokenWithBearer) return res.status(401).send("Access denied.");

			// split the token from the bearer
			const newToken = tokenWithBearer.split(" ")[1];

			// verify the token
			const verified = jwt.verify(newToken, process.env.TOKENSECRATE);

			// assign the verified token to the request object auth property
			req.auth = verified; // set the request "authorized" property with the validation result
			req.role = verified.role; // set the request "authorized" property with the validation result

			// check if is roles is in the roles array
			if (roles.length > 0 && !roles.includes(verified.role)) {
				return res.status(401).send("Access Denied");
			}
			next();
		} catch (err) {
			console.log(err);
			return res.status(501).json(err);
		}
	};
};

function companyToken(req, res, next) {
	try {
		// get the authorization token from the request header
		const tokenWithBearer = req.header("Authorization");
		console.log(tokenWithBearer);

		if (!tokenWithBearer) return res.status(401).send("Access denied.");

		// split the token from the bearer
		const newToken = tokenWithBearer.split(" ")[1];
		console.log(` token ` + newToken);

		// verify the token
		if (tokenWithBearer == jwt.verify(newToken, process.env.COMPANYTOKEN)) {
			console.log(verified);
			req.company = verified;
			console.log(req.company);
			next();
		}
		return res.status(401).send("Access denied. authorization failed ");
	} catch (error) {
		// return next(error);
		res.status(500).json({ success: false, message: error.message });
	}
}

// Middleware function for route authentication
function authenticateToken(req, res, next) {
	try {
		const authHeader = req.header("Authorization");
		const token = authHeader.split(" ")[1];
		console.log(token);

		if (!token)
			return res.status(401).send(`Access denied. No token provided.`);
		// Verify the token
		if (token === process.env.COMPANYTOKEN) {
			req.token = token;
			console.log(req.token);
			next();
		}
		return res.status(401).send(`Access denied. Invalid token provided.`);
	} catch (error) {
		// return next(error);
		res.status(500).json({ success: false, message: error.message });
	}
}

function multiHandlerToken(req, res, next) {
	const authHeader = req.headers.authorization;
	const tokenWithoutBearer = authHeader && authHeader.replace("Bearer ", "");
	//console.log(tokenWithoutBearer);
	const tokens = tokenWithoutBearer
		? tokenWithoutBearer.split(",")
		: tokenWithoutBearer;

	if (tokens.length !== 2) {
		return res.status(401).json({ success: false, message: "Unauthorized" });
	}

	const authorize = tokens[0];
	const authenticateCompany = tokens[1];
	//console.log("token");

	// console.log(authorize);
	// console.log("--------------------------------");
	// console.log(authenticateCompany);

	authorizeToken = jwt.verify(authorize, process.env.TOKENSECRATE);

	// assign the verified token to the request object auth property
	req.auth = authorizeToken; // set the request "authorized" property with the validation result
	req.role = authorize.role; // set the request "authorized" property with the validation result
	// console.log(req.auth);

	if (req.auth.role == "admin") {
		// Check if the token is valid (Custom validation logic)
		authenticateCompany === process.env.COMPANYTOKEN;
		// Token is valid, proceed to the next middleware or route handler
		// console.log("Token is valid");
		next();
	} else {
		// Token is invalid, return a 401 Unauthorized error
		//res.sendStatus(401);
		res.status(401).json({ success: false, message: "Unauthorized" });
	}
}

// generate secret token with crypto
const generateSecretToken = () => {
	const token = crypto.randomBytes(32).toString("hex");
	return token;
};

// Function to generate a token with the company ID
const generateToken = (companyId) => {
	const payload = { companyId };
	const secretKey = process.env.COMPANYTOKEN;
	const options = { expiresIn: "1y" }; // Set the token expiration time as desired

	return jwt.sign(payload, secretKey, options);
};

const verifyToken = (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];
	const secretKey = process.env.COMPANYTOKEN;

	if (!token) {
		return res.status(401).json({ message: "unauthorized access token" });
	}

	jwt.verify(token, secretKey, async (err, decoded) => {
		if (err) {
			return res.status(403).json({ message: "invalid access token" });
		}

		const company = await company_model.findById(decoded.companyId);
		req.company = company;

		next();
	});
};

const matchToken = (req, res, next) => {
	if (req.company.token == req.headers.authorization?.split(" ")[1]) {
		next();
	} else {
		return res.status(403).json({ message: "invalid access token" });
	}
};

// export the auth and authorize function to be used in other files
module.exports = {
	auth,
	authorize,
	companyToken,
	authenticateToken,
	multiHandlerToken,
	generateToken,
	verifyToken,
	matchToken,
};
