"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const user_model_1 = require("../database/models/user.model");
const passport_local_1 = __importDefault(require("passport-local"));
const LocalStrategy = passport_local_1.default.Strategy;
passport_1.default.use(new LocalStrategy({
    // Strategy is based on username & password.  Substitute email for username.
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => {
    user_model_1.User.findOne({ email })
        .populate({
        path: "diary",
        populate: {
            path: "review",
            select: "game.imageId rating",
        },
    })
        .populate({
        path: "diary",
        populate: {
            path: "gameFeel",
            select: "game.imageId gameStatus",
        },
    })
        .then((user) => {
        if (!user) {
            return done(null, false, { message: "Incorrect credentials" });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: "Incorrect credentials" });
        }
        return done(null, user);
    })
        .catch(done);
}));
//# sourceMappingURL=passport.js.map