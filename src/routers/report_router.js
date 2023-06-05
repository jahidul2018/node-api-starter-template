const express = require("express");
const ReportRouter = express.Router();
const Report = require("../controllers/report_controller");
const { auth } = require("../auth/auth");

// Routes
// GET() ->fetching data
// Post() -> sending data,
// Put() -> updating data,
// Delete() -> deleting data

// ReportRouter.get('/get-all', (req, res) => res.send('this is report route for all data!'))
ReportRouter.get("/", Report.test);
// summary routes
ReportRouter.get("/summary", Report.getSummary);

module.exports = ReportRouter;
