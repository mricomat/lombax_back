import passport from "passport";
import IUserModel, { User } from "../database/models/user.model";
import { Diary } from "../database/models/diary.model";
import passportLocal from "passport-local";
import { ObjectId } from "mongodb";

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
            select: "game.imageId rating summary",
          },
          options: { sort: { createdAt: -1 } },
        })
        .populate({
          path: "diary",
          populate: {
            path: "gameFeel",
            select: "game.imageId gameStatus like",
          },
          options: { sort: { createdAt: -1 } },
        })

        .then(async (user: IUserModel) => {
          const counts = await User.aggregate()
            .match({ _id: new ObjectId(user._id) })
            .project({
              _id: 0,
              reviewsCount: {
                $size: "$reviews",
              },
              diaryCount: {
                $size: "$diary",
              },
              gameFeelsCount: {
                $size: "$gameFeels",
              },
            });
          if (!user) {
            return done(null, false, { message: "Incorrect credentials" });
          }
          if (!user.validPassword(password)) {
            return done(null, false, { message: "Incorrect credentials" });
          }
          return done(null, { ...user, counts });
        })
        .catch(done);
    }
  )
);
