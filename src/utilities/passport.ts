import passport from "passport";
import IUserModel, { User } from "../database/models/user.model";
import passportLocal from "passport-local";

const LocalStrategy = passportLocal.Strategy;

passport.use(
  new LocalStrategy(
    {
      // Strategy is based on username & password.  Substitute email for username.
      usernameField: "email",
      passwordField: "password",
    },

    (email, password, done) => {
      User.findOne({ email })
        .then((user: IUserModel) => {
          if (!user) {
            return done(null, false, { message: "Incorrect email." });
          }
          if (!user.validPassword(password)) {
            return done(null, false, { message: "Incorrect password." });
          }
          return done(null, user);
        })
        .catch(done);
    }
  )
);
