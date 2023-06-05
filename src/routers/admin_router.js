const express = require("express");
const AdminRouter = express.Router();
const Admin = require("../controllers/admin_controller");
const { auth, authorize } = require("../auth/auth");

// Routes
// GET() ->fetching data
// Post() -> sending data,
// Put() -> updating data,
// Delete() -> deleting data

AdminRouter.get("/test", (req, res) => res.send("this is admin route!"));
// AdminRouter.get('/get-all', (req, res) => res.send('this is admin route for all data!'))

// auth routes

// login
AdminRouter.post("/login", Admin.login);
// signup
AdminRouter.post("/signup", Admin.register);
// get all admin
AdminRouter.get("/", Admin.getAdmins);
// get Auth admin
AdminRouter.get("/info", authorize("admin"), Admin.me);
// get admin by id
AdminRouter.get("/:id", authorize(["admin"]), Admin.getAdminById);

// admin routes export
module.exports = AdminRouter;
