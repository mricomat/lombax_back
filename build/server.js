"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./utilities/logger"));
app_1.default
    .listen(process.env.PORT || 5000, () => {
    logger_1.default.info(`server running on port : ${process.env.PORT || 5000}`);
    console.log(`server running on port : ${process.env.PORT || 5000}`);
})
    .on('error', (e) => logger_1.default.error(e));
//# sourceMappingURL=server.js.map