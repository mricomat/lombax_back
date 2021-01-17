import passport from "passport";
import IUserModel, { User } from "../database/models/user.model";
import { Diary } from "../database/models/diary.model";
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
        .populate({
          path: "diary",
          populate: {
            path: "review",
            select: "game.imageId rating",
          },
          options: { sort: { createdAt: -1 } },
        })
        .populate({
          path: "diary",
          populate: {
            path: "gameFeel",
            select: "game.imageId gameStatus",
          },
          options: { sort: { createdAt: -1 } },
        })

        .then((user: IUserModel) => {
          if (!user) {
            return done(null, false, { message: "Incorrect credentials" });
          }
          if (!user.validPassword(password)) {
            return done(null, false, { message: "Incorrect credentials" });
          }
          return done(null, user);
        })
        .catch(done);
    }
  )
);
