"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
const errorHandling_service_1 = require("./services/errorHandling.service");
const user_route_1 = __importDefault(require("./routes/user.route"));
const investment_route_1 = __importDefault(require("./routes/investment.route"));
const database_config_1 = __importDefault(require("./configs/database.config"));
const dataSource_1 = require("./configs/dataSource");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
// ========== CONFIGURATIONS ========== //
(0, dotenv_1.config)();
console.log(process.env.NODE_ENV, process.env.EMAIL_FROM, process.env.EMAIL_PASSWORD);
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
(0, database_config_1.default)();
app.set("trust proxy", true);
app.set("view engine", "pug");
app.set("views", path_1.default.join(__dirname, "views"));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
// ========== ROUTES ========== //
app.all("/", (req, res) => res.send("HELLO FROM OMNISTOCK SERVER"));
dataSource_1.dataSource
    .initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization", err);
});
app.use("/api/v2/user", user_route_1.default);
app.use("/api/v2/investment", investment_route_1.default);
// ========== ERROR HANDLING ========== //
app.all("*", (req, res, next) => next(new errorHandling_service_1.AppError(`Can't find ${req.originalUrl} on this server!`, 404)));
app.use(errorHandling_service_1.globalErrorHandler);
app.listen(PORT, () => console.log(`SERVER STARTED ON http://localhost:${PORT}`));
