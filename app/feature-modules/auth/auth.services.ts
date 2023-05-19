import { compare, genSalt, hash } from "bcryptjs";
import { IUser } from "../user/user.types";
import userServices from "../user/user.services";
import { ICredentials, Payload } from "./auth.types";
import { AUTH_RESPONSES } from "./auth.responses";
import fs from "fs";
import jwt, { verify } from "jsonwebtoken";
import path from "path";
import { Roles } from "../roles/roles.types";

const encryptUserPassword = async (user: IUser) => {
  const salt = await genSalt(10);
  const hashedPassword = await hash(user.password, salt);
  user.password = hashedPassword;
  return user;
};

const register = async (user: IUser) => {
  if (user.password) {
    user.role = Roles.ADMIN.toString();
  } else {
    user.password = "password";
  }
  user = await encryptUserPassword(user);
  const record = await userServices.createUser(user);
  return record;
};

const login = async (credentials: ICredentials) => {
  const user = await userServices.findUser({ email: credentials.email });
  if (!user) throw AUTH_RESPONSES.INVALID_CREDENTIALS;
  const isPasswordValid = await compare(credentials.password, user.password);
  if (!isPasswordValid) throw AUTH_RESPONSES.INVALID_CREDENTIALS;
  const { _id, role } = user;
  const PRIVATE_KEY = fs.readFileSync(
    path.resolve(__dirname, "..\\..\\keys\\private.pem"),
    {
      encoding: "utf-8",
    }
  );
  try {
    var token = jwt.sign({ id: _id, role: role }, PRIVATE_KEY || "", {
      algorithm: "RS256",
      expiresIn: "100s",
    });
    var refreshToken = jwt.sign({ id: _id, role: role }, PRIVATE_KEY || "", {
      algorithm: "RS256",
      expiresIn: "1000s",
    });
    return { token, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

const refreshToken = (token: string) => {
  const PUBLIC_KEY = fs.readFileSync(
    path.resolve(__dirname, "..\\..\\keys\\public.pem"),
    { encoding: "utf-8" }
  );

  const tokenDecode = verify(token || "", PUBLIC_KEY || "") as Payload;
  const PRIVATE_KEY = fs.readFileSync(
    path.resolve(__dirname, "..\\..\\keys\\private.pem"),
    { encoding: "utf-8" }
  );
  if (tokenDecode) {
    const accessToken = jwt.sign(
      { id: tokenDecode.id, role: tokenDecode.role },
      PRIVATE_KEY || "",
      { algorithm: "RS256", expiresIn: "900s" }
    );
    return { accessToken };
  } else {
    throw { statusCode: 400, message: "Token invalid" };
  }
};

export default {
  register,
  login,
  refreshToken,
};
