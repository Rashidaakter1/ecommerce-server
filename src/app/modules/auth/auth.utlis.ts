import jwt, { JwtPayload } from "jsonwebtoken";

const createToken = (
  jwtPayload: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: expiresIn,
  });
};

export default createToken;
