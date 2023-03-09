import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
  try {
    if (!token) {
      console.log("token -> Null");
      return null;
    }
    const { id } = await jwt.verify(token, process.env.SECRET_KEY);
    const user = await client.user.findUnique({ where: { id } });
    // console.log("user from token : ", user);
    if (user) {
      return user;
    } else {
      console.log("user not found from the token");
      return null;
    }
  } catch (e) {
    console.log("error : ", e);
    return null;
  }
};

export const protectedResolver =
  (ourResolver) => (root, args, context, info) => {
    if (!context.loggedInUser) {
      const query = info.operation.operation === "query";
      if (query) {
        return null;
      } else {
        return {
          ok: false,
          error: "Please, login to perform this action",
        };
      }
    }
    return ourResolver(root, args, context, info);
  };
