import { Request } from "express";
import jwt from "express-jwt";
import { JWT_SECRET } from "./secrets";
import * as jwtoken from "jsonwebtoken";

const getTokenFromHeader = (req: Request): string | null => {
  const headerAuth: string | string[] = req.headers.authorization;

  if (headerAuth !== undefined && headerAuth !== null) {
    if (Array.isArray(headerAuth)) {
      return splitToken(headerAuth[0]);
    } else {
      return splitToken(headerAuth);
    }
  } else {
    return null;
  }
};

const splitToken = (authString: string) => {
  if (authString.split(" ")[0] === "Token") {
    return authString.split(" ")[1];
  } else {
    return null;
  }
};

export const validateToken = (req: Request): any => {
  return jwtoken.verify(getTokenFromHeader(req), JWT_SECRET, (err, user) => {
    if (err) {
      return null;
    }
    return user;
  });
};

const auth = {
  required: jwt({
    credentialsRequired: true,
    secret: JWT_SECRET,
    getToken: getTokenFromHeader,
    userProperty: "payload",
    // @ts-ignore
    algorithms: ["HS256"],
  }),

  optional: jwt({
    credentialsRequired: false,
    secret: JWT_SECRET,
    getToken: getTokenFromHeader,
    userProperty: "payload",
    algorithms: ["HS256"],
  }),
};

export const authentication = auth;
