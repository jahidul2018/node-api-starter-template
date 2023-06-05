const createError = require("http-errors");
const bcrypt = require("bcrypt");
const { request } = require("express");

const Admin = require("../models/admin_model");
const Cce = require("../models/cce_model");
const Company = require("../models/company_model");
const Counsellor = require("../models/counsellor_model");
const Client = require("../models/client_model");
exports.test = async (req, res, next) => {
	res.status(200).json({
		success: true,
		message: "test",
	});
};

exports.getReport = async (req, res, next) => {
	return res.status(200).json({
		success: true,
		message: "report",
	});
};
exports.getReportByCompany = async (req, res, next) => {};

exports.getReportByCounsellor = async (req, res, next) => {};

exports.getReportByCce = async (req, res, next) => {};

exports.getReportByClient = async (req, res, next) => {};

exports.getSummary = async (req, res, next) => {
	const clientCount = await Client.countDocuments();
	const counsellorCount = await Counsellor.countDocuments();
	const cceCount = await Cce.countDocuments();
	const companyCount = await Company.countDocuments();
	const adminCount = await Admin.countDocuments();

	const activeClientCount = await Client.countDocuments({ status: true });
	const activeCounsellorCount = await Counsellor.countDocuments({
		status: true,
	});
	const activeCceCount = await Cce.countDocuments({ status: true });
	const activeCceApiCount = await Cce.countDocuments({
		status: true,
		apiStatus: true,
	});
	const activeCompanyCount = await Company.countDocuments({ status: true });
	const activeAdminCount = await Admin.countDocuments({ status: true });

	return res.status(200).json({
		success: true,
		data: {
			"total-clients": clientCount,
			"active-clients": activeClientCount,
			"total-counsellor": counsellorCount,
			"total-call-center-executive": cceCount,
			"total-company": companyCount,
			"total-admin": adminCount,
			"active-counsellor": activeCounsellorCount,
			"active-call-center-executive": activeCceCount,
			"active-call-center-executive-api": activeCceApiCount,
			"active-company": activeCompanyCount,
			"active-admin": activeAdminCount,
		},
	});
};
