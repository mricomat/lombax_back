"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = exports.validateToken = void 0;
const express_jwt_1 = __importDefault(require("express-jwt"));
const secrets_1 = require("./secrets");
const jwtoken = __importStar(require("jsonwebtoken"));
const getTokenFromHeader = (req) => {
    const headerAuth = req.headers.authorization;
    if (headerAuth !== undefined && headerAuth !== null) {
        if (Array.isArray(headerAuth)) {
            return splitToken(headerAuth[0]);
        }
        else {
            return splitToken(headerAuth);
        }
    }
    else {
        return null;
    }
};
const splitToken = (authString) => {
    if (authString.split(" ")[0] === "Token") {
        return authString.split(" ")[1];
    }
    else {
        return null;
    }
};
const validateToken = (req) => {
    return jwtoken.verify(getTokenFromHeader(req), secrets_1.JWT_SECRET, (err, user) => {
        if (err) {
            return null;
        }
        return user;
    });
};
exports.validateToken = validateToken;
const auth = {
    required: express_jwt_1.default({
        credentialsRequired: true,
        secret: secrets_1.JWT_SECRET,
        getToken: getTokenFromHeader,
        userProperty: "payload",
        // @ts-ignore
        algorithms: ["HS256"],
    }),
    optional: express_jwt_1.default({
        credentialsRequired: false,
        secret: secrets_1.JWT_SECRET,
        getToken: getTokenFromHeader,
        userProperty: "payload",
        algorithms: ["HS256"],
    }),
};
exports.authentication = auth;
//# sourceMappingURL=authentication.js.map