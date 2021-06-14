import { JwtModuleOptions } from '@nestjs/jwt';

const { JWT_SECRET, JWT_ISSUER } = process.env;

export default {
  secret: JWT_SECRET,
  signOptions: {
    issuer: JWT_ISSUER,
  },
} as JwtModuleOptions;
