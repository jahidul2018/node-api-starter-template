const express = require("express");
const CounsellorRouter = express.Router();
const Counsellor = require("../controllers/counsellor_controller");
const { auth } = require("../auth/auth");

// Routes
// GET() ->fetching data
// Post() -> sending data,
// Put() -> updating data,
// Delete() -> deleting data

CounsellorRouter.get("/test", (req, res) =>
	res.send("this is counsellor route!")
);
// CounsellorRouter.get('/get-all', (req, res) => res.send('this is counsellor route for all data!'))

// get all counsellors
CounsellorRouter.get("/", Counsellor.getAllCounsellor);
// get single counsellor
CounsellorRouter.get("/:id", Counsellor.getCounsellorById);
// create a new counsellor
CounsellorRouter.post("/", Counsellor.createCounsellor);
// update counsellor
CounsellorRouter.put("/:id", Counsellor.updateCounsellor);
// delete counsellor
CounsellorRouter.delete("/:id", Counsellor.deleteCounsellor);

module.exports = CounsellorRouter;
