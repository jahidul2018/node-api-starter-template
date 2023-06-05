const multer = require("multer");
const filesystem = require("fs");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadDir = "./src/uploads/";
		if (!filesystem.existsSync(uploadDir)) {
			filesystem.mkdirSync(uploadDir);
		}
		cb(null, uploadDir);
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "-" + file.originalname);
	},
});

const upload = multer({
	storage: storage,
	fileFilter: (req, file, callback) => {
		if (
			file.mimetype ===
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
			file.mimetype === "text/csv" ||
			file.mimetype === "application/vnd.ms-excel"
		) {
			callback(null, true);
		} else {
			callback(new Error("Invalid file type. Only Excel files are allowed."));
		}
	},

	// limits: (req, file, cb) => {
	// 	if (file.size > 1000000) {
	// 		cb(new Error("File size cannot be more than 1MB"));
	// 	}
	// },

	// fileFilter: (req, file, cb) => {
	// 	cb(null, true);
	// },
});

// export upload
module.exports = upload;
