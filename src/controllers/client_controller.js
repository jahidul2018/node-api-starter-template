const { request } = require("express");
const Client = require("../models/client_model");
const createError = require("http-errors");
const Cce = require("../models/cce_model");
const exceljs = require("exceljs");
const parser = new (require("simple-excel-to-json").XlsParser)();
const fs = require("fs");
const path = require("path");
// file upload functions

// end file upload functions

// get all clients
// {host}/api/client/
exports.getClients = async (req, res, next) => {
	try {
		const client = await Client.find();
		if (!client) {
			return next(createError(404, "client dose not exist."));
		}
		res.status(200).json({
			success: true,
			count: client.length,
			data: client,
			message: "client found",
		});
	} catch (error) {
		// next(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// get single client
// get {host}/api/client/:id
exports.getClientById = async (req, res, next) => {
	const clientId = req.params.id;
	try {
		const client = await Client.findById(clientId);
		if (!client) {
			return next(createError(404, "client dose not exist."));
		}
		res.status(200).json({
			success: true,
			data: client,
			message: "client found",
		});
	} catch (error) {
		// next(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// create client
// post {host}/api/client/

exports.createClientdefault = async (req, res, next) => {
	console.log(req.body);
	try {
		const client = await Client.create(req.body);
		res.status(201).json({
			success: true,
			data: client,
			count: client.length,
			message: "client created",
		});
	} catch (error) {
		// next(error);
		console.log(error.message);
		res.status(500).json({
			success: false,
			message: `something wants wrong - ` + error.message,
		});
	}
};

exports.createClientByAPi = async (req, res, next) => {
	// console.log("createClientByAPi");
	// console.log(req.body);

	try {
		// console.log(req.body);
		const data = { ...req.body };

		// return res.status(200).json({
		// 	data: data,
		// 	info: req.company,
		// });

		const clientinfo = { clientinfo: data, company: req.company._id };

		// assign cce counsellor to the client data with api status true

		const client = await Client.create(clientinfo);
		const clientId = client._id;

		// if client created then assign cce to the client
		if (client) {
			const cces = await Cce.find({ status: true, apiStatus: true }).lean();
			const randomIndex = Math.floor(Math.random() * cces.length);
			const randomCce = cces[randomIndex];

			console.log(randomCce);

			const updatedClient = await Client.findByIdAndUpdate(
				clientId,
				{ cce: randomCce._id },
				{ new: true }
			);

			res.status(201).json({
				success: true,
				data: updatedClient,
				count: updatedClient.length,
				message: "client added",
			});
		}
	} catch (error) {
		// next(error);
		console.log(error.message);
		res.status(500).json({
			success: false,
			message: `something wants wrong - ` + error.message,
		});
	}
};

// update client

// put {host}/api/client/:id
exports.updateClient = async (req, res, next) => {
	console.log(req.body);
	const clientId = req.params.id;
	console.log(clientId);
	try {
		let oldClient = await Client.findById(clientId);
		if (!oldClient) {
			return next(createError(404, "client dose not exist."));
		}

		const updateClientData = { ...oldClient._doc };
		updateClientData = { ...updateClientData, ...req.body };
		console.log(updateClientData);

		// const client = await Client.findByIdAndUpdate(
		// 	clientId, // id
		// 	updateClientData, // update data
		// 	{ new: true } // option
		// );
		// console.log(client);

		// if something wrong in the update
		if (!client) {
			return next(createError(404, "client dose not exist."));
		}
		// send response back to client with update data
		return res.status(200).json({
			success: true,
			data: updateClientData,
			message: "client data updated",
		});
	} catch (error) {
		// next(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

exports.updateClientCounsellorById = async (req, res, next) => {
	const clientId = req.params.id;
	const client = await Client.findByIdAndUpdate(
		clientId,
		{ counsellorId: req.body.counsellorId },
		{ new: true }
	);
	res.status(201).json({
		success: true,
		data: client,
		count: client.length,
		message: "client  counsellor added successfully",
	});
};

function importFile(filePath) {
	//  Read Excel File to Json Data
	var arrayToInsert = [];
	csvtojson()
		.fromFile(filePath)
		.then((source) => {
			// Fetching the all data from each row
			for (var i = 0; i < source.length; i++) {
				console.log(source[i]["name"]);
				var singleRow = {
					name: source[i]["name"],
					email: source[i]["email"],
					standard: source[i]["standard"],
				};
				arrayToInsert.push(singleRow);
			}
			//inserting into the table student
			Student.insertMany(arrayToInsert, (err, result) => {
				if (err) console.log(err);
				if (result) {
					console.log("File imported successfully.");
				}
			});
		});
}

exports.uploadFile = async (req, res, next) => {
	try {
		// convert excel file to json
		const doc = parser.parseXls2Json(req.file.path);
		// clean the data from the excel file
		function clean(obj) {
			for (const key in obj) {
				if (obj.hasOwnProperty(key) && /^\s*$/.test(obj[key])) {
					delete obj[key];
				}
				if (key === "_id") {
					delete obj[key];
				}
			}
			return obj;
		}
		// clean data from the excel file
		const newData = [];
		doc[0].forEach((data, index) => {
			newData.push(clean(data));
		});

		// json data should be saved in the database

		// file delete
		const oldPhotoWithPath = path.join("src", "uploads", req.file.filename);
		if (!fs.existsSync(oldPhotoWithPath)) {
			return res.status(404).json({
				message: "file does not exist",
				status: false,
			});
		}
		fs.unlink(oldPhotoWithPath, (err) => {
			if (err) {
				console.log("Culd not delete photos");
			}
			console.log("Old file deleted");
		});

		res.status(200).json({
			success: true,
			data: newData,
			message: "file uploaded successfully",
		});
	} catch (error) {
		return next(createError(404, `file upload error: ${error.message}`));
	}
};

exports.downloadExcel = async (req, res, next) => {
	try {
		const clients = await Client.find();

		// Create a new workbook and worksheet
		const workbook = new exceljs.Workbook();
		const worksheet = workbook.addWorksheet("Clients");

		// Define column headers
		const columns = [
			{ header: "Name", key: "name" },
			{ header: "Email", key: "email" },
			{ header: "Phone", key: "phone" },
			{ header: "Age", key: "age" },
			{ header: "Gender", key: "gender" },
			{ header: "Campaign", key: "campain" },
			{ header: "Entry Date", key: "entryDate" },
		];
		worksheet.columns = columns;

		// Add client data to the worksheet
		clients.forEach((client) => {
			worksheet.addRow(client.toObject());
		});

		// Set the response type to indicate Excel file
		res.setHeader(
			"Content-Type",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		);
		res.setHeader(
			"Content-Disposition",
			"attachment; filename=" + "clients.xlsx"
		);

		// Send workbook to the client
		await workbook.xlsx.write(res);
		res.end();

		// Save the workbook to a file
		// await workbook.xlsx.writeFile("clients.xlsx");
		console.log("Data exported to Excel successfully");
	} catch (error) {
		console.error("Error exporting data to Excel:", error);
	}
};
