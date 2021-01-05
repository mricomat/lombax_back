import express from "express";
import { Application } from "express";
import { MainRouter } from "./routes";
import cors from "cors";
import { loadErrorHandlers } from "./utilities/error-handling";
import session from "express-session";
import helmet from "helmet";
import passport from "passport";
import compression from "compression";
import { SESSION_SECRET } from "./utilities/secrets";
import "./database"; // initialize database
import "./utilities/passport";

const app: Application = express();

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public')); 
app.use(
  session({
    secret: SESSION_SECRET,
    cookie: {
      maxAge: 60000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api", MainRouter);

loadErrorHandlers(app);

export default app;
