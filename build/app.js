"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const cors_1 = __importDefault(require("cors"));
const error_handling_1 = require("./utilities/error-handling");
const express_session_1 = __importDefault(require("express-session"));
const helmet_1 = __importDefault(require("helmet"));
const passport_1 = __importDefault(require("passport"));
const compression_1 = __importDefault(require("compression"));
const secrets_1 = require("./utilities/secrets");
require("./database"); // initialize database
require("./utilities/passport");
const app = express_1.default();
app.use(helmet_1.default());
app.use(compression_1.default());
app.use(cors_1.default({
    origin: "*",
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static("public"));
app.use(express_session_1.default({
    secret: secrets_1.SESSION_SECRET,
    cookie: {
        maxAge: 60000,
    },
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/api", routes_1.MainRouter);
error_handling_1.loadErrorHandlers(app);
exports.default = app;
//# sourceMappingURL=app.js.map