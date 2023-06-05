const express = require("express");

const CompanyRouter = express.Router();
const Company = require("../controllers/company_controller");

const { auth, verifyToken } = require("../auth/auth");

// Routes
// GET() ->fetching data
// Post() -> sending data,
// Put() -> updating data,
// Delete() -> deleting data

CompanyRouter.get("/test", (req, res) => res.send("this Company route!"));
// CompanyRouter.get('/get-all', (req, res) => res.send('this route for all data!'))

// get all
CompanyRouter.get("/", Company.get);
// create a new
CompanyRouter.post("/", Company.create);

// check if company token
CompanyRouter.get("/check", verifyToken, (req, res) =>
	res.json({ success: true, data: req.company })
);

// Create a token
CompanyRouter.post("/token/:id", Company.createToken);
// get single
CompanyRouter.get("/:id", Company.getById);
// update
CompanyRouter.put("/:id", Company.update);
// delete
CompanyRouter.delete("/:id", Company.delete);

// route module export as CompanyRouter;
module.exports = CompanyRouter;
