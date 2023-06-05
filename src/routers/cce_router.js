const express = require("express");

const CceRouter = express.Router();
const Cce = require("../controllers/cce_controller");

const auth = require("../auth/auth");

// Routes
// GET() ->fetching data
// Post() -> sending data,
// Put() -> updating data,
// Delete() -> deleting data

CceRouter.get("/test", (req, res) => res.send("this is cce route!"));
// CceRouter.get('/get-all', (req, res) => res.send('this is cce route for all data!'))

// auth routes
CceRouter.post("/login", Cce.login);
// get all cces
CceRouter.get("/", Cce.getAll);
// get single cce
CceRouter.get("/:id", Cce.getSingle);
// create a new cce
CceRouter.post("/", Cce.create);
// update cce
CceRouter.put("/:id", Cce.update);
// delete cce
CceRouter.delete("/:id", Cce.delete);

module.exports = CceRouter;
