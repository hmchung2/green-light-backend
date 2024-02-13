import jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async (token) => {
  try {
    if (!token) {
      // console.log("token -> Null");
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

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};
