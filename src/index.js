const express = require("express");
const app = express();
const dotenv = require("dotenv");
const db = require("./config/db_connect");

const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const createError = require("http-errors");
const { error_handler } = require("./error/error_handler");

const AdminRouter = require("./routers/admin_router");
const ClientRouter = require("./routers/client_router");
const CceRouter = require("./routers/cce_router");
const CounsellorRouter = require("./routers/counsellor_router");
const CompanyRouter = require("./routers/company_router");
const ReportRouter = require("./routers/report_router");

// cors
app.use(cors());

// format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// .env
dotenv.config();

// connect to mongodb
db();

// compretion data before response
app.use(
	compression({
		level: 6,
		threshold: 100 * 1000,
		filter: (req, res) => {
			if (req.headers["x-on-compression"]) {
				return false;
			}
			return compression.filter(req, res);
		},
	})
);

// routes

// rate limit
// app.use(
// 	rateLimit({
// 		windowMs: 5000, // 5 secound
// 		max: 5, // Limit each IP to 5 requests per `window` (here, per 5 secound)
// 		standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
// 		legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// 		message: {
// 			code: 429,
// 			message: "Too many request.",
// 		},
// 	})
// );

app.get("/api", (req, res) => {
	res.send("welcome to gic-call-center-client-data-api");
});

app.use("/api/admin", AdminRouter);
app.use("/api/client", ClientRouter);
app.use("/api/cce", CceRouter);
app.use("/api/counsellor", CounsellorRouter);
app.use("/api/company", CompanyRouter);
app.use("/api/report", ReportRouter);
app.use((req, res, next) => {
	next(createError(404, "route dose not exist - 404"));
});

// error handler
app.use(error_handler);

// port
app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
