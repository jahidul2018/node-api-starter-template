const express = require("express");

const ClientRouter = express.Router();
const Client = require("../controllers/client_controller");

const upload = require("../utils/multer");
const {
	auth,
	authorize,
	companyToken,
	authenticateToken,
	multiHandlerToken,
	verifyToken,
	matchToken,
} = require("../auth/auth");

// Routes
// GET() ->fetching data
// Post() -> sending data,
// Put() -> updating data,
// Delete() -> deleting data

ClientRouter.get("/test", (req, res) => res.send("this is client route!"));
// ClientRoute.get('/get-all', (req, res) => res.send('this is client route for all data!'))

// get all clients
ClientRouter.get("/", Client.getClients);
// create a new client
ClientRouter.post("/", Client.createClientdefault);
//upload files to server
ClientRouter.post("/upload", upload.single("excelfile"), Client.uploadFile);

// download client file as excel file
ClientRouter.get("/download", Client.downloadExcel);
// mach Client API create
// ClientRouter.post("/mach",[authorize("admin"), authenticateToken],Client.createClientByAPi);
ClientRouter.post("/mach", verifyToken, matchToken, Client.createClientByAPi);
// get single client
ClientRouter.get("/:id", Client.getClientById);
// update client
ClientRouter.put("/:id", Client.updateClient);
ClientRouter.put("/assign/counsellor/:id", Client.updateClientCounsellorById);

module.exports = ClientRouter;
